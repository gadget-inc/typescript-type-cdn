import { FastifyReply } from "fastify/fastify";

export const cacheIfProd = (reply: FastifyReply) => {
  if (process.env.NODE_ENV !== "development") {
    reply.header("cache-control", "public, max-age=86400");
  }
};
