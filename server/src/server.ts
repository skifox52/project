import fastify from "fastify"
import "dotenv/config"
import fastifyJwt from "@fastify/jwt"
import { authRouter } from "./modules/auth/auth.route"
import fastifyHelmet from "@fastify/helmet"
import fastifyCors from "@fastify/cors"
import fastifyBcrypt from "fastify-bcrypt"
import fastifySwagger from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"

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

//routes registration
server.register(authRouter, { prefix: "api/auth" })

//app listen
server.listen({ port: +process.env.PORT!, host: "0.0.0.0" })
