import { z } from "zod"
import {
  genericErrorMessages,
  phoneNumberRegex,
} from "../../util/globals/global"
import { buildJsonSchemas } from "fastify-zod"
import { returnApiError } from "../../util/schemas/global.schema"

const { email, minLength, invalid, phone, required } = genericErrorMessages

//login schemas
const loginSchema = z.object({
  login: z
    .string({ required_error: required })
    .email({ message: email })
    .or(
      z
        .string({ required_error: required, invalid_type_error: invalid })
        .regex(phoneNumberRegex, { message: phone })
    ),
  password: z
    .string({ required_error: required })
    .min(8, { message: minLength }),
})

const loginResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    login: z.string(),
    accessToken: z.string(),
  }),
})

//logout schema
const logoutResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    message: z.string(),
  }),
})

//refresh access schema
const refreshAccessResponse = z.object({
  success: z.boolean(),
  data: z.object({
    accessToken: z.string(),
  }),
})

const responseError = returnApiError

export type loginInput = z.infer<typeof loginSchema>

export const { schemas: authSchema, $ref } = buildJsonSchemas({
  loginSchema,
  loginResponseSchema,
  logoutResponseSchema,
  refreshAccessResponse,
  responseError,
})
