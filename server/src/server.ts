import fastify from "fastify"
import "dotenv/config"
import fastifyJwt from "@fastify/jwt"
import fastifyHelmet from "@fastify/helmet"
import fastifyCors from "@fastify/cors"
import fastifyBcrypt from "fastify-bcrypt"
import fastifySwagger from "@fastify/swagger"
import fastifyCookie from "@fastify/cookie"
import { authRouter } from "./modules/auth/auth.route"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { userRoute } from "./modules/user/user.route"

//server init
export const server = fastify({ logger: true })

//modules registration
server.register(fastifyHelmet)
server.register(fastifyCors, { origin: "0.0.0.0:3000" })
server.register(fastifyBcrypt, { saltWorkFactor: 12 })
server.register(fastifySwagger)
server.register(fastifySwaggerUi)
server.register(fastifyJwt, {
  secret: process.env.ACCESS_TOKEN_SECRET as string,
})
server.register(fastifyCookie, { hook: "preHandler" })

//routes registration
server.register(authRouter, { prefix: "api/auth" })
server.register(userRoute, { prefix: "api/user" })

//app listen
server.listen({ port: +process.env.PORT!, host: "0.0.0.0" })
