import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteHandlerMethod,
} from "fastify"
import {
  loginUserController,
  logoutUserController,
  refreshAccessController,
} from "./auth.controller"
import { authSchema, $ref } from "./auth.schema"
import { ErrorHandler } from "../../util/globals/ErrorHandler"

//utility function
const isRefreshCookie = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.cookies["refreshToken"])
    throw new ErrorHandler("Refreshtoken required")
}

//authentication router
export const authRouter = async (server: FastifyInstance) => {
  authSchema.forEach((s) => server.addSchema(s))
  //login route
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
  //logout route
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
      preHandler: isRefreshCookie,
    },
    logoutUserController
  )
  //refresh access token route
  server.post(
    "/refresh",
    {
      schema: {
        response: {
          201: $ref("refreshAccessResponse"),
          400: $ref("responseError"),
        },
      },
      preHandler: isRefreshCookie,
    },
    refreshAccessController
  )
}
