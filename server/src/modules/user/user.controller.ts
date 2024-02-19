import { FastifyReply, FastifyRequest } from "fastify"
import { RegisterUserInput } from "./user.schema"
import { createUser, saveRefreshToken } from "./user.service"
import { app } from "../../server"
import { findUserByCredentials } from "../auth/auth.service"

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
    password,
    phoneNumber,
    role,
  } = request.body

  const user = await findUserByCredentials(email)
  if (user) {
    const error = new Error("User already exist")
  }

  const hashedPassword = await app.bcrypt.hash(password)
  const createdUser = await createUser({
    adress,
    avatar,
    dateOfBirth,
    email,
    firstName,
    gender,
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
  const refreshToken = app.jwt.sign({ id: createdUser.id })
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
