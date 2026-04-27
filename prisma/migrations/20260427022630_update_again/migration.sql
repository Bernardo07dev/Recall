-- AlterTable
ALTER TABLE "Empresas" ADD COLUMN     "files" TEXT[] DEFAULT ARRAY[]::TEXT[];
