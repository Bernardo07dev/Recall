/*
  Warnings:

  - Added the required column `industry` to the `Empresas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Empresas" ADD COLUMN     "industry" TEXT NOT NULL,
ALTER COLUMN "json" DROP NOT NULL;
