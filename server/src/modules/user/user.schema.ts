import { z } from "zod"
import { phoneNumberRegex } from "../../util/global"
import { buildJsonSchemas } from "fastify-zod"

const registerUserSchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string().regex(phoneNumberRegex),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.date(),
  adress: z.string(),
  avatar: z.string(),
  role: z.enum(["USER", "DOCTOR", "ADMIN"]),
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

const registerUserError = z.object({
  success: z.boolean(),
  error: z.string(),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export const { schemas: userSchema, $ref } = buildJsonSchemas({
  registerUserSchema,
  registerUserReponse,
  registerUserError,
})

export interface RefreshTokenInput {
  userId: string
  refreshToken: string
}
