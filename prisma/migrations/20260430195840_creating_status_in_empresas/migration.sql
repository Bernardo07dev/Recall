-- DropForeignKey
ALTER TABLE "Conversations" DROP CONSTRAINT "Conversations_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Conversations" DROP CONSTRAINT "Conversations_userId_fkey";

-- AlterTable
ALTER TABLE "Empresas" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'processing';

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
