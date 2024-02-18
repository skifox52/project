import { z } from "zod"
import { genericErrorMessages, phoneNumberRegex } from "../../util/global"
import { buildJsonSchemas } from "fastify-zod"

const { email, minLength, invalid, phone, required } = genericErrorMessages

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
  id: z.string(),
  login: z.string(),
  accessToken: z.string(),
})

export type loginInput = z.infer<typeof loginSchema>
export const { schemas: authSchema, $ref } = buildJsonSchemas({
  loginSchema,
  loginResponseSchema,
})
