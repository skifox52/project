import { FastifyInstance } from "fastify"
import { loginUserController, logoutUserController } from "./auth.controller"
import { authSchema, $ref } from "./auth.schema"

export const authRouter = async (server: FastifyInstance) => {
  for (const schema of authSchema) {
    server.addSchema(schema)
  }

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          201: $ref("loginResponseSchema"),
          401: $ref("loginResponseError"),
        },
      },
    },
    loginUserController
  )

  server.delete("/logout", { schema: {} }, logoutUserController)
}
