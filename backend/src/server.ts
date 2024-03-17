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
import { prismaClientInstance } from "./util/globals/prismaClient"
import { ErrorHandler } from "./util/globals/ErrorHandler"
import { Roles } from "./util/types/global.types"
import { sendSms } from "./util/globals/config"

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

//decorators
app.decorate(
  "authenticate",
  (roles?: Roles[]) => async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
      if (roles && roles.length) {
        if (!roles.includes(request.user.role))
          throw new ErrorHandler("Unauthorized", 401)
      }
    } catch (error) {
      throw new ErrorHandler("Unauthorized", 401)
    }
  }
)
sendSms("test").then((res) => console.log("sms response \n", res))
//TO REMOVE
//endpoint to load wilayas into the database
//----------------------
app.get("/setWilaya", async (request, reply) => {
  console.time("test")
  const { wilayas } = await import("./util/globals/wilaya")
  wilayas.forEach(async (w) => {
    await prismaClientInstance.wilaya.create({
      data: {
        id: +w.code,
        name: w.name,
        latitude: +w.latitude,
        longitude: +w.longitude,
      },
    })
  })
  console.timeEnd("test")
  reply.code(201).send({ success: true })
})

//---------------------

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
