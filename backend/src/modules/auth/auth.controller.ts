import { FastifyReply, FastifyRequest } from "fastify"
import {
  deleteRefreshTokenService,
  findUserByCredentialsService,
  refreshAccessTokenService,
  verifyEmailService,
} from "./auth.service"
import { loginInput, verifyEmailInput } from "./auth.schema"
import { app } from "../../server"
import { saveRefreshTokenService } from "../user/user.service"
import { ErrorHandler } from "../../util/globals/ErrorHandler"
import { JWT_EXPIRATION } from "../../util/globals/config"

export const loginUserController = async (
  request: FastifyRequest<{
    Body: loginInput
  }>,
  reply: FastifyReply
) => {
  const { login, password } = request.body
  const user = await findUserByCredentialsService({
    email: login,
    phoneNumber: login,
  })
  if (!user) {
    throw new ErrorHandler("Invalid credentials", 401)
  } else {
    if (!user.isActive)
      throw new ErrorHandler("Please verify your email adress", 401)
    const passwordMatch = await app.bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new ErrorHandler("Invalid credentials", 401)
    const accessToken = app.jwt.sign(
      {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      { expiresIn: JWT_EXPIRATION }
    )
    const refreshToken = app.jwt.sign({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    })
    await saveRefreshTokenService({ userId: user.id, refreshToken })
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

export const verifyEmailController = async (
  request: FastifyRequest<{ Body: verifyEmailInput }>,
  reply: FastifyReply
) => {
  try {
    const { email } = request.body
    await verifyEmailService(email)
    reply.code(200).send({
      success: true,
      data: {
        message: "Email verified",
      },
    })
  } catch (error) {
    throw new ErrorHandler(error.message, 400)
  }
}

export const logoutUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { count } = await deleteRefreshTokenService(
      request.cookies["refreshToken"] as string
    )
    if (count === 0) throw new ErrorHandler("Invalid refreshToken", 400)
    return reply.code(200).send({
      success: true,
      data: {
        message: "Logged out successfully",
      },
    })
  } catch (error) {
    throw new ErrorHandler(error, 400)
  }
}

export const refreshAccessController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const accessToken = await refreshAccessTokenService(
    request.cookies["refreshToken"] as string
  )
  return reply.code(201).send({
    success: true,
    data: {
      accessToken,
    },
  })
}
