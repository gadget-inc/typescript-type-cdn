import FastifyCors from "fastify-cors";

export default async function (server) {
  await server.register(FastifyCors, {
    origin: true, // allow requests from any domain
  });
};