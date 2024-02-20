import { prismaClientInstance } from "../../util/prismaClient"

export const findUserByCredentials = async (login: string) => {
  const user = await prismaClientInstance.user.findFirst({
    where: { OR: [{ email: login }, { phoneNumber: login }] },
  })
  return user
}

export const deleteRefreshToken = async (userId: string) => {
  return await prismaClientInstance.refreshToken.delete({ where: { userId } })
}
