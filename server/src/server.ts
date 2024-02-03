import fastify from "fastify"
import "dotenv/config"

const server = fastify({ logger: true })

server.listen({ port: +process.env.PORT! }, () =>
  console.log(`App running on ${process.env.PORT}`)
)
