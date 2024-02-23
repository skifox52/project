/*
  Warnings:

  - Added the required column `adress` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'DOCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "adress" TEXT NOT NULL,
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL;
