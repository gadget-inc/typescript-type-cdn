import type { RouteContext } from "gadget-server";
import pMap from "p-map";
import { cacheIfProd } from "../../../../services/caching";
import { TypesArtifactBuilder } from "../../../../services/TypesArtifactBuilder";
import { parsePackageVersion } from "../../../utils";

async function route({ request, reply, api, logger }: RouteContext<{ Querystring: { packages: string } }>) {
  const packages = request.query.packages.split(",");
  const builders: TypesArtifactBuilder[] = packages.map((packageVersion: string) => {
    const [packageName, version] = parsePackageVersion(packageVersion);
    return new TypesArtifactBuilder(packageName, version);
  });

  const results = await pMap(builders, async (builder) => {
    try {
      return await builder.getTypes(api);
    } catch (err) {
      logger.error(
        {
          error: err,
          name: builder.packageName,
          version: builder.packageVersion,
        },
        "Failed to build types"
      );
    }
  });
  const types = results.filter(Boolean);

  cacheIfProd(reply);

  await reply.send(types);
}

(route as any).options = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        packages: {
          type: "string",
        },
      },
      required: ["packages"],
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            package: { type: "string" },
            version: { type: "string" },
            files: { type: "object", additionalProperties: true },
          },
        },
      },
    },
  },
};

export default route;
