import { z } from "zod"
import { phoneNumberRegex } from "../../util/globals/global"
import { buildJsonSchemas } from "fastify-zod"
import { returnApiError } from "../../util/schemas/global.schema"

//create user
const registerUserSchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string().regex(phoneNumberRegex),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  codeWilaya: z.number(),
  dateOfBirth: z.date(),
  adress: z.string(),
  avatar: z.string(),
  role: z.enum(["USER", "DOCTOR", "ADMIN"]),
  specialitites: z.array(z.string()).optional(),
})

const registerUserReponse = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    login: z.string(),
    role: z.enum(["USER", "DOCTOR", "ADMIN"]),
    accessToken: z.string(),
  }),
})
export type RegisterUserInput = z.infer<typeof registerUserSchema>

//update user
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(phoneNumberRegex).optional(),
  password: z.string().min(8).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  codeWilaya: z.number().optional(),
  dateOfBirth: z.date().optional(),
  adress: z.string().optional(),
  avatar: z.string().optional(),
  role: z.enum(["USER", "DOCTOR", "ADMIN"]).optional(),
  specialitites: z.array(z.string()).optional().optional(),
})

const userIdQueryString = z.object({
  id: z.string(),
})

const updateUserResponse = z.object({
  success: z.boolean(),
  message: z.string(),
})

export interface RefreshTokenInput {
  userId: string
  refreshToken: string
}

export type updateuserInput = z.infer<typeof updateUserSchema>

const registerUserError = returnApiError

export const { schemas: userSchema, $ref } = buildJsonSchemas({
  registerUserSchema,
  registerUserReponse,
  userIdQueryString,
  updateUserResponse,
  registerUserError,
  updateUserSchema,
})
