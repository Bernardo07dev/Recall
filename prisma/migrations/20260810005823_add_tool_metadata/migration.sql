-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Tool';

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "toolMetadata" JSONB;
