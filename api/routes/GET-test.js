import { TypesArtifactBuilder } from "../../services/TypesArtifactBuilder";
/**
 * Route handler for test 
 *
 * @param { import("gadget-server").RouteContext } request context - Everything for handling this route, like the api client, Fastify request, Fastify reply, etc. More on effect context: https://docs.gadget.dev/guides/extending-with-code#effect-context
 *
 * @see {@link https://www.fastify.io/docs/latest/Reference/Request}
 * @see {@link https://www.fastify.io/docs/latest/Reference/Reply}
 */
module.exports = async ({ request, reply, api, logger, connections }) => {
  const got = await new TypesArtifactBuilder("got", "11.0.0").buildTypes();
  const typesReact = await new TypesArtifactBuilder("@types/react", "18.0.28").buildTypes();
  const gadgetReact = await new TypesArtifactBuilder("@gadgetinc/react", "0.12.1").buildTypes();


  await reply.send({
    got: Object.keys(got),
    typesReact: Object.keys(typesReact),
    gadgetReact: Object.keys(gadgetReact),
  })
}
