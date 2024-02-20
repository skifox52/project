import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import "dotenv/config"
import fastifyJwt from "@fastify/jwt"
import fastifyHelmet from "@fastify/helmet"
import fastifyCors from "@fastify/cors"
import fastifyBcrypt from "fastify-bcrypt"
import fastifySwagger from "@fastify/swagger"
import { authRouter } from "./modules/auth/auth.route"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { userRoute } from "./modules/user/user.route"
import { fastifyCookie } from "@fastify/cookie"

//server init
export const app = fastify({ logger: true })

//modules registration
app.register(fastifyHelmet)
app.register(fastifyCors, { origin: "0.0.0.0:3000" })
app.register(fastifyBcrypt, { saltWorkFactor: 12 })
app.register(fastifySwagger)
app.register(fastifySwaggerUi)
app.register(fastifyCookie)
app.register(fastifyJwt, {
  secret: process.env.ACCESS_TOKEN_SECRET as string,
})

//routes registration
app.register(authRouter, { prefix: "api/auth" })
app.register(userRoute, { prefix: "api/user" })

//Custom error handler
app.setErrorHandler(
  (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    reply
      .code(error.statusCode || 500)
      .send({ success: false, error: error.message })
  }
)

//app listen
app.listen({ port: +process.env.PORT!, host: "0.0.0.0" })
