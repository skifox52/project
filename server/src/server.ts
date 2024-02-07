import fastify from "fastify"
import "dotenv/config"

const server = fastify({ logger: true })

server.listen({ port: +process.env.PORT!, host: "0.0.0.0" })
