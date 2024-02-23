import { FastifyInstance } from "fastify"
import { $ref, userSchema } from "./user.schema"
import { registerUserController } from "./user.controller"

export const userRoute = async (server: FastifyInstance) => {
  userSchema.forEach((s) => {
    server.addSchema(s)
  })

  server.post(
    "/",
    {
      schema: {
        body: $ref("registerUserSchema"),
        response: {
          201: $ref("registerUserReponse"),
          400: $ref("registerUserError"),
        },
      },
    },
    registerUserController
  )
}
