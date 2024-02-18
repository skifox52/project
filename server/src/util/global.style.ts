import { FastifyReply, FastifyRequest } from "fastify"

export type ControllerSignature = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>

declare module "fastify" {}
