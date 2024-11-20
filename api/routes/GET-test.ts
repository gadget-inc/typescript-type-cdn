import { RouteHandler } from "gadget-server";
import { TypesArtifactBuilder } from "../../services/TypesArtifactBuilder";

const route: RouteHandler = async ({ request, reply, api, logger, connections }) => {
  const got = await new TypesArtifactBuilder("got", "11.0.0").buildTypes();
  const typesReact = await new TypesArtifactBuilder("@types/react", "18.0.28").buildTypes();
  const gadgetReact = await new TypesArtifactBuilder("@gadgetinc/react", "0.12.1").buildTypes();

  await reply.send({
    got: Object.keys(got),
    typesReact: Object.keys(typesReact),
    gadgetReact: Object.keys(gadgetReact),
  });
};
