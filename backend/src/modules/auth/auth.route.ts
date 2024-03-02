import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteHandlerMethod,
} from "fastify"
import { loginUserController, logoutUserController } from "./auth.controller"
import { authSchema, $ref } from "./auth.schema"
import { ErrorHandler } from "../../util/globals/ErrorHandler"

export const authRouter = async (server: FastifyInstance) => {
  authSchema.forEach((s) => server.addSchema(s))

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          201: $ref("loginResponseSchema"),
          401: $ref("responseError"),
        },
      },
    },
    loginUserController
  )
  server.delete(
    "/logout",
    {
      schema: {
        response: {
          200: $ref("logoutResponseSchema"),
          400: $ref("responseError"),
        },
      },
      onRequest: [server.authenticate()],
      preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.cookies["refreshToken"])
          throw new ErrorHandler("Refreshtoken required")
      },
    },
    logoutUserController
  )
}
