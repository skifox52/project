import { Prisma, User } from "@prisma/client"
import { prismaClientInstance } from "../../util/globals/prismaClient"
import { app } from "../../server"
import { ErrorHandler } from "../../util/globals/ErrorHandler"
import { JWT } from "../../util/types/global.types"

export const findUserByCredentialsService = async ({
  email,
  phoneNumber,
}: {
  email: string
  phoneNumber: string
}): Promise<User | null> => {
  const user = await prismaClientInstance.user.findFirst({
    where: { OR: [{ email }, { phoneNumber }] },
  })
  return user
}

export const verifyEmailService = async (email: string): Promise<User> => {
  return await prismaClientInstance.user.update({
    where: { email },
    data: { isActive: true },
  })
}

export const deleteRefreshTokenService = async (
  refreshToken: string
): Promise<Prisma.BatchPayload> => {
  return await prismaClientInstance.refreshToken.deleteMany({
    where: { refreshToken },
  })
}

export const refreshAccessTokenService = async (
  refreshToken: string
): Promise<string> => {
  if (
    !(await prismaClientInstance.refreshToken.findFirst({
      where: { refreshToken },
    }))
  )
    throw new ErrorHandler("Invalid session", 401)
  const { iat, ...decodedUserData } = app.jwt.verify(refreshToken) satisfies JWT
  const accessToken = app.jwt.sign(decodedUserData)
  console.log(decodedUserData, accessToken)
  return accessToken
}
