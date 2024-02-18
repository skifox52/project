import { FastifyReply, FastifyRequest } from "fastify"

export type TcontrollerSignature = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>
