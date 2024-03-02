import { FastifyReply, FastifyRequest } from "fastify"
import { deleteRefreshToken, findUserByCredentials } from "./auth.service"
import { loginInput } from "./auth.schema"
import { app } from "../../server"
import { saveRefreshToken } from "../user/user.service"
import { ErrorHandler } from "../../util/globals/ErrorHandler"

export const loginUserController = async (
  request: FastifyRequest<{
    Body: loginInput
  }>,
  reply: FastifyReply
) => {
  const { login, password } = request.body
  const user = await findUserByCredentials(login)
  if (!user) {
    throw new ErrorHandler("Invalid credentials", 401)
  } else {
    const passwordMatch = await app.bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new ErrorHandler("Invalid credentials", 401)
    const accessToken = app.jwt.sign(
      {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      { expiresIn: "5m" }
    )
    const refreshToken = app.jwt.sign({
      id: user.id,
    })
    await saveRefreshToken({ userId: user.id, refreshToken })
    return reply
      .code(201)
      .setCookie("refreshToken", refreshToken, {
        domain: "0.0.0.0",
        httpOnly: true,
        sameSite: true,
        // secure: true [in production]
      })
      .send({
        success: true,
        data: { id: user.id, login: user.email, role: user.role, accessToken },
      })
  }
}

export const logoutUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { count } = await deleteRefreshToken(
      request.cookies["refreshToken"] as string
    )
    if (count === 0) throw new ErrorHandler("Invalid refreshToken", 400)
    reply.code(200).send({
      success: true,
      data: {
        message: "Logged out successfully",
      },
    })
  } catch (error) {
    throw new ErrorHandler(error, 400)
  }
}
