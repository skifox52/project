import { Prisma, RefreshToken, User } from "@prisma/client"
import { prismaClientInstance } from "../../util/globals/prismaClient"
import {
  RefreshTokenInput,
  RegisterUserInput,
  updateuserInput,
} from "./user.schema"

export const createUserService = async (
  input: RegisterUserInput
): Promise<User> => {
  return await prismaClientInstance.user.create({ data: input })
}

export const saveRefreshTokenService = async (
  input: RefreshTokenInput
): Promise<RefreshToken> => {
  return await prismaClientInstance.refreshToken.create({ data: input })
}

export const saveDoctorSpecialitiesService = async (
  specialities: string[],
  doctorId: string
): Promise<Prisma.BatchPayload> => {
  return await prismaClientInstance.spacialitiesOnDoctors.createMany({
    data: specialities.map((speciality) => ({
      doctorId,
      specialityId: speciality,
    })),
  })
}

export const updateUserService = async (
  id: string,
  data: updateuserInput
): Promise<User> => {
  return await prismaClientInstance.user.update({ where: { id }, data })
}
