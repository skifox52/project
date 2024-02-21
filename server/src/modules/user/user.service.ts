import { prismaClientInstance } from "../../util/globals/prismaClient"
import { RefreshTokenInput, RegisterUserInput } from "./user.schema"

export const createUser = async (input: RegisterUserInput) => {
  return await prismaClientInstance.user.create({ data: input })
}

export const saveRefreshToken = async (input: RefreshTokenInput) => {
  return await prismaClientInstance.refreshToken.create({ data: input })
}
