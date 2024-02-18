import { FastifyReply, FastifyRequest } from "fastify"
import { findUserByCredentials } from "./auth.service"
import { loginInput } from "./auth.schema"

export const loginUserController = async (
  request: FastifyRequest<{
    Body: loginInput
  }>,
  reply: FastifyReply
) => {
  const { login, password } = request.body
  const user = await findUserByCredentials({ login, password })
  if (!user)
    reply.code(400).send({ success: false, message: "Invalid credentials" })
  reply.code(201).send({ id: "success", login: "test", accessToken: "dfjdf" })
}
