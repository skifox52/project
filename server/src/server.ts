import Fastify from "fastify"
import "dotenv/config"

const fastify = Fastify({ logger: true })

fastify.listen({ port: +process.env.PORT!, host: "localhost" })
