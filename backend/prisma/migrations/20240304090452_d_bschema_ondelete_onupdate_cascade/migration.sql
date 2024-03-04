-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpacialitiesOnDoctors" DROP CONSTRAINT "SpacialitiesOnDoctors_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "SpacialitiesOnDoctors" DROP CONSTRAINT "SpacialitiesOnDoctors_specialityId_fkey";

-- AddForeignKey
ALTER TABLE "SpacialitiesOnDoctors" ADD CONSTRAINT "SpacialitiesOnDoctors_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpacialitiesOnDoctors" ADD CONSTRAINT "SpacialitiesOnDoctors_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
