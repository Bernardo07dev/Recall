/*
  Warnings:

  - Added the required column `updatedAt` to the `Conversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversations" ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
