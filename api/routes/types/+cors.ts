import FastifyCors from "@fastify/cors";
import { FastifyPluginAsync } from "fastify";

const plugin: FastifyPluginAsync = async (server) => {
  await server.register(FastifyCors, {
    origin: true, // allow requests from any domain
  });
};

export default plugin;
