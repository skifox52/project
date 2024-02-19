import { FastifyReply, FastifyRequest } from "fastify"

declare module "fastify" {
  export interface FastifyInstance {
    user?: {
      id: string
      role: "USER" | "ADMIN" | "DOCTOR"
    }
  }
}
