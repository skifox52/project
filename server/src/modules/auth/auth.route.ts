import { FastifyInstance } from "fastify"
import { loginService } from "./auth.service"

export const authRouter = (instance: FastifyInstance) => {
  instance.post("/login", loginService)
}
