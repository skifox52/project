import { FastifyReply, FastifyRequest } from "fastify"

type ExistingUser = FastifyRequest["user"]

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: (
      roles?: Roles[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string
      email: string
      phoneNumber: string
      role: "USER" | "ADMIN" | "DOCTOR"
      iat: number
    }
  }
}

export type Roles = "ADMIN" | "USER" | "DOCTOR"

export type JWT = {
  id: string
  email: string
  phoneNumber: string
  role: Roles
  iat?: number
}

export interface BrevoSmsApiResponse {
  data: Object
  status: number
  statusText: string
  headers: Object
  config: Object
}
