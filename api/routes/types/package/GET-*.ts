import { TypesArtifactBuilder } from "../../../../services/TypesArtifactBuilder";
import type { RouteContext } from "gadget-server";
import { cacheIfProd } from "../../../../services/caching";

function parsePackageVersion(input) {
  const atIndex = input.lastIndexOf('@');

  if (atIndex === -1) {
    throw new Error('Invalid input format: Missing "@"');
  }

  const packageName = input.slice(0, atIndex);
  const version = input.slice(atIndex + 1);

  if (!packageName || !version) {
    throw new Error('Invalid input format: Missing package name or version');
  }

  return [
    packageName,
    version
  ];
}

async function route({ request, reply, api }: RouteContext) {
  const [packageName, version] = parsePackageVersion(request.params['*'])
  const builder = new TypesArtifactBuilder(packageName, version);
  const types = await builder.getTypes(api);

  cacheIfProd(reply);

  await reply.send(types)
}


(route as any).options = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          package: { type: 'string' },
          version: { type: 'string' },
          files: { type: "object", additionalProperties: true }
        }
      }
    }
  }
};

export default route;