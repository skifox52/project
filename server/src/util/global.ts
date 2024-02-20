import { buildJsonSchemas } from "fastify-zod"
import { z } from "zod"

export const genericErrorMessages = {
  minLength: "Password must contain at least 8 characters",
  required: "This field is required",
  invalid: "Invalid data type",
  email: "Invalid e-mail adress",
  phone: "Invalid phone number",
  pattern: "REGEX",
  format: "EMAIL",
}

export const phoneNumberRegex = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/

const { invalid, required } = genericErrorMessages
export const requiredInvalidValidation = {
  required_error: required,
  invalid_type_error: invalid,
}

export const returnApiError = z.object({
  success: z.boolean().default(false),
  error: z.string(),
})

//custom error handler
export function ErrorHandler(message: string, statusCode?: number) {
  const error = new Error(message)
  this.message = error.message
  this.statusCode = statusCode
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ErrorHandler)
  } else {
    this.stack = new Error().stack
  }
}
ErrorHandler.prototype = Object.create(Error.prototype)
ErrorHandler.prototype.contructor = ErrorHandler
