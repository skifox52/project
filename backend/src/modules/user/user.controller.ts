import { FastifyReply, FastifyRequest } from "fastify"
import { RegisterUserInput, updateuserInput } from "./user.schema"
import {
  createUserService,
  saveDoctorSpecialitiesService,
  saveRefreshTokenService,
  updateUserService,
} from "./user.service"
import { app } from "../../server"
import { findUserByCredentialsService } from "../auth/auth.service"
import { ErrorHandler } from "../../util/globals/ErrorHandler"
import { JWT_EXPIRATION, transporter } from "../../util/globals/config"

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

  await transporter.sendMail({
    from: '"DocToDoor 👨‍⚕️" <contact.doc.to.door@gmail.com>',
    to: createdUser.email,
    subject: "Email verification ✔",
    html: `<div style="padding: 1rem;">
            <h2>Please Verify Your Email</h2>
            <p>Click the button below to verify your email address:</p>
            <a href="{verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
          </div>`,
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

export const updateUserController = async (
  request: FastifyRequest<{
    Body: updateuserInput
    Querystring: { id: string }
  }>,
  reply: FastifyReply
) => {
  await updateUserService(request.query.id, request.body)
  //check if user exist

  //then update
}
