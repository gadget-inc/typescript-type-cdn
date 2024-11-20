import type { RouteContext } from "gadget-server";
import { cacheIfProd } from "../../../../services/caching";
import { TypesArtifactBuilder } from "../../../../services/TypesArtifactBuilder";
import { parsePackageVersion } from "../../../utils";

async function route({ request, reply, api }: RouteContext<{ Params: { "*": string } }>) {
  const [packageName, version] = parsePackageVersion(request.params["*"]);
  const builder = new TypesArtifactBuilder(packageName, version);
  const types = await builder.getTypes(api);

  cacheIfProd(reply);

  await reply.send(types);
}

(route as any).options = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          package: { type: "string" },
          version: { type: "string" },
          files: { type: "object", additionalProperties: true },
        },
      },
    },
  },
};

export default route;
