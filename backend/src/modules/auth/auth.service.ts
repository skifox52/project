import { User } from "@prisma/client"
import { prismaClientInstance } from "../../util/globals/prismaClient"
import { app } from "../../server"
import { ErrorHandler } from "../../util/globals/ErrorHandler"
import { JWT } from "../../util/types/global.types"

export const findUserByCredentials = async (
  login: string
): Promise<User | null> => {
  const user = await prismaClientInstance.user.findFirst({
    where: { OR: [{ email: login }, { phoneNumber: login }] },
  })
  return user
}

export const deleteRefreshToken = async (
  refreshToken: string
): Promise<{ count: number }> => {
  return await prismaClientInstance.refreshToken.deleteMany({
    where: { refreshToken },
  })
}

export const refreshAccessToken = async (
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
