import { FastifyReply, FastifyRequest } from "fastify"
import { findUserByCredentials } from "./auth.service"
import { loginInput } from "./auth.schema"
import { app } from "../../server"
import { saveRefreshToken } from "../user/user.service"

export const loginUserController = async (
  request: FastifyRequest<{
    Body: loginInput
  }>,
  reply: FastifyReply
) => {
  const { login, password } = request.body
  const user = await findUserByCredentials(login)
  if (!user) {
    return reply
      .code(401)
      .send({ success: false, message: "Invalid credentials" })
  } else {
    const passwordMatch = await app.bcrypt.compare(password, user.password)
    if (!passwordMatch)
      return reply
        .code(401)
        .send({ success: false, message: "Invalid credentials" })
    const accessToken = app.jwt.sign({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    })
    const refreshToken = app.jwt.sign({
      id: user.id,
    })
    await saveRefreshToken({ userId: user.id, refreshToken })
    app.decorate("user", { id: user.id, role: user.role })
    return reply
      .code(201)
      .setCookie("refreshToken", refreshToken)
      .send({
        success: true,
        data: { id: user.id, login: user.email, role: user.role, accessToken },
      })
  }
}
