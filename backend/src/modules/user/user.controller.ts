import { FastifyReply, FastifyRequest } from "fastify"
import { RegisterUserInput } from "./user.schema"
import { createUser, saveRefreshToken } from "./user.service"
import { app } from "../../server"
import { findUserByCredentials } from "../auth/auth.service"
import { ErrorHandler } from "../../util/globals/ErrorHandler"

export const registerUserController = async (
  request: FastifyRequest<{ Body: RegisterUserInput }>,
  reply: FastifyReply
) => {
  const {
    adress,
    avatar,
    dateOfBirth,
    email,
    firstName,
    gender,
    lastName,
    codeWilaya,
    password,
    phoneNumber,
    role,
  } = request.body

  const user =
    !!(await findUserByCredentials(email)) ||
    !!(await findUserByCredentials(phoneNumber))
  if (user) throw new ErrorHandler("User already exist", 400)

  const hashedPassword = await app.bcrypt.hash(password)
  const createdUser = await createUser({
    adress,
    avatar,
    dateOfBirth,
    email,
    firstName,
    gender,
    codeWilaya,
    lastName,
    password: hashedPassword,
    phoneNumber,
    role,
  })
  const accessToken = app.jwt.sign({
    id: createdUser.id,
    email: createdUser.email,
    phoneNumber: createdUser.phoneNumber,
    role: createdUser.role,
  })
  const refreshToken = app.jwt.sign({ id: createdUser.id }, { expiresIn: "5m" })
  await saveRefreshToken({ userId: createdUser.id, refreshToken })
  return reply
    .code(201)
    .setCookie("refreshToken", refreshToken)
    .send({
      success: true,
      data: {
        id: createdUser.id,
        login: createdUser.email,
        accessToken,
        role: createdUser.role,
      },
    })
}
