import { prismaClientInstance } from "../../util/prismaClient"
import { loginInput } from "./auth.schema"

export const findUserByCredentials = async ({
  login,
  password,
}: loginInput) => {
  const user = await prismaClientInstance.user.findFirst({
    where: { OR: [{ email: login }, { phoneNumber: login }] },
  })
  return user
}
