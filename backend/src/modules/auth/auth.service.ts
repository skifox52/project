import { prismaClientInstance } from "../../util/globals/prismaClient"

export const findUserByCredentials = async (login: string) => {
  const user = await prismaClientInstance.user.findFirst({
    where: { OR: [{ email: login }, { phoneNumber: login }] },
  })
  return user
}

export const deleteRefreshToken = async (refreshToken: string) => {
  return await prismaClientInstance.refreshToken.deleteMany({
    where: { refreshToken },
  })
}
