import { z } from "zod"
import { genericErrorMessages } from "../globals/global"

const { invalid, required } = genericErrorMessages
export const requiredInvalidValidation = {
  required_error: required,
  invalid_type_error: invalid,
}

export const returnApiError = z.object({
  success: z.boolean().default(false),
  error: z.string(),
})
