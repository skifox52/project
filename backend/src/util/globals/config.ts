import { createTransport } from "nodemailer"
import "dotenv/config"
import { ErrorHandler } from "./ErrorHandler"
import { BrevoSmsApiResponse } from "../types/global.types"

//change it to 5m in prod
export const JWT_EXPIRATION = "55555555555555555m"

export const transporter = createTransport({
  host: String(process.env.SMTP_SERVER),
  port: Number(process.env.SMTP_SERVER),
  secure: false,
  auth: {
    user: String(process.env.SMTP_USER),
    pass: String(process.env.SMTP_PASSWORD),
  },
})

export const sendSms = async (sms: string): Promise<BrevoSmsApiResponse> => {
  const apiUrl = process.env.SMS_API_URL as string
  const apiKey = process.env.SMS_API_KEY as string
  const smsData = {
    to: "+216671386548",
    message: "Test sms",
  }

  try {
    const response = await (
      await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(smsData),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })
    ).json()
    return response
  } catch (error) {
    console.log(error)
    throw new ErrorHandler(error.message, error.code)
  }
}
