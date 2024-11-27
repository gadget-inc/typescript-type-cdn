import type { Client } from "@gadget-client/typescript-type-cdn";
import HttpAgent from "agentkeepalive";
import getNPMTarballURL from "get-npm-tarball-url";
import getStream from "get-stream";
import got from "got";
import gunzip from "gunzip-maybe";
import path from "path";
import tar from "tar-stream";

const agent = new HttpAgent();
const client = got.extend({
  agent: {
    http: agent,
  },
  timeout: {
    connect: 3000,
    request: 20000,
  },
  retry: {
    limit: 5,
  },
});

function stripLeadingDirectory(filepath: string) {
  if (typeof filepath !== "string") {
    throw new TypeError("Filepath must be a string");
  }

  const pathParts = filepath.split(path.sep);

  if (pathParts.length > 1) {
    pathParts.shift(); // Remove the leading directory
  }

  return pathParts.join(path.sep);
}

export class TypesArtifactBuilder {
  constructor(readonly packageName: string, readonly packageVersion: string) {}

  async getTypes(api: Client): Promise<Record<string, string>> {
    const cacheKey = `${this.packageName}@${this.packageVersion}`;
    const caches = await api.internal.cache.findMany({ first: 1, filter: { packageVersion: { equals: cacheKey } } });
    let types;
    if (caches[0]) {
      types = JSON.parse(caches[0].serializedTypes);
    } else {
      types = await this.buildTypes();
      // save types to the cache but out of band for the best response time
      void this.saveCacheEntry(api, cacheKey, types);
    }
    return { package: this.packageName, version: this.packageVersion, files: types };
  }

  /**
   * Assemble a { [path: string]: string } map of type-relevant files for this package
   *
   * Works by downloading the package tarball from NPM and pulling out the .d.ts files as it streams in
   **/
  async buildTypes(): Promise<Record<string, string>> {
    const currentPackageName = this.packageName;
    const tarballURL = getNPMTarballURL(currentPackageName, this.packageVersion);
    console.log(`rebuilding types from tarball ${tarballURL}`);
    const tarballStream = client.stream.get(tarballURL);

    const files: Record<string, string> = {};

    await new Promise<void>((resolve, reject) => {
      const extract = tar.extract();

      extract.on("entry", async function (header, stream, next) {
        stream.on("end", function () {
          next(); // ready for next entry
        });

        if (header.type == "file") {
          // all files in the tarball start with a package/ or <package-name>/ prefix
          const fileName = stripLeadingDirectory(header.name);
          if (
            path.basename(fileName) == "package.json" ||
            fileName.endsWith(".d.ts") ||
            fileName.endsWith(".d.mts") ||
            fileName.endsWith(".d.cts") ||
            (packagesThatNeedAllTsFiles.has(currentPackageName) && (fileName.endsWith(".ts") || fileName.endsWith(".mts") || fileName.endsWith(".cts")))
          ) {
            files[fileName] = await getStream(stream);
          } else if (fileName.endsWith(".json")) {
            files[fileName] = "{}";
            stream.resume();
          } else {
            stream.resume();
          }
        } else {
          stream.resume();
        }
      });

      extract.on("finish", function () {
        resolve();
      });

      tarballStream
        .on("error", (err) => {
          reject(err);
        })
        .pipe(gunzip())
        .pipe(extract);
    });

    return files;
  }

  private async saveCacheEntry(api: Client, cacheKey: string, types: any) {
    try {
      await api.internal.cache.create({ cache: { packageVersion: cacheKey, serializedTypes: JSON.stringify(types) } });
    } catch (error: any) {
      if (error.code == "GGT_INVALID_RECORD") {
        console.warn("suppressing cache race error -- something else built it already");
      } else {
        console.error({ error }, "error saving cache entry for types");
      }
    }
  }
}

const packagesThatNeedAllTsFiles = new Set(["@shopify/app-bridge-types", "openai"]);
