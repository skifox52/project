/*
  Warnings:

  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codeWilaya]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codeWilaya` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropIndex
DROP INDEX "RefreshToken_userId_key";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeWilaya" INTEGER NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ALTER COLUMN "avatar" SET DEFAULT 'default-avatar.png';

-- CreateTable
CREATE TABLE "Wilaya" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_codeWilaya_key" ON "User"("codeWilaya");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_codeWilaya_fkey" FOREIGN KEY ("codeWilaya") REFERENCES "Wilaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
