import { createTransport } from "nodemailer"
import "dotenv/config"

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
