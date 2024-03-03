import { FastifyReply, FastifyRequest } from "fastify"
import { RegisterUserInput } from "./user.schema"
import {
  createUserService,
  saveDoctorSpecialitiesService,
  saveRefreshTokenService,
} from "./user.service"
import { app } from "../../server"
import { findUserByCredentialsService } from "../auth/auth.service"
import { ErrorHandler } from "../../util/globals/ErrorHandler"
import { JWT_EXPIRATION } from "../../util/globals/config"

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
    specialitites,
  } = request.body

  const user = await findUserByCredentialsService({ email, phoneNumber })

  if (!!user) {
    throw new ErrorHandler("User already exist", 400)
  }

  if (role === "DOCTOR" && !specialitites?.length) {
    throw new ErrorHandler("Doctor must provide at least one speciality")
  }

  const hashedPassword = await app.bcrypt.hash(password)

  const createdUser = await createUserService({
    adress,
    avatar,
    dateOfBirth,
    email: email.toLocaleLowerCase(),
    firstName: firstName.toLocaleLowerCase(),
    lastName: lastName.toLocaleLowerCase(),
    gender,
    codeWilaya,
    password: hashedPassword,
    phoneNumber,
    role,
  })

  if (createdUser.role === "DOCTOR" && specialitites?.length) {
    await saveDoctorSpecialitiesService(specialitites, createdUser.id)
  }

  const accessToken = app.jwt.sign(
    {
      id: createdUser.id,
      email: createdUser.email,
      phoneNumber: createdUser.phoneNumber,
      role: createdUser.role,
    },
    { expiresIn: JWT_EXPIRATION }
  )

  const refreshToken = app.jwt.sign({
    id: createdUser.id,
    email: createdUser.email,
    phoneNumber: createdUser.phoneNumber,
    role: createdUser.role,
  })

  await saveRefreshTokenService({ userId: createdUser.id, refreshToken })
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

export const updateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {}
