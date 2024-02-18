import { FastifyInstance } from "fastify"
import { loginUserController } from "./auth.controller"
import { authSchema, $ref } from "./auth.schema"

export const authRouter = async (server: FastifyInstance) => {
  for (const schema of authSchema) {
    server.addSchema(schema)
  }

  server.post(
    "/",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          201: $ref("loginResponseSchema"),
        },
      },
    },
    loginUserController
  )
}
