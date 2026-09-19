-- AlterTable: add isPublic with default, and ownerId as NULLABLE first
ALTER TABLE "Empresas" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Empresas" ADD COLUMN "ownerId" TEXT;

-- Backfill: assign existing empresas to the first user in the database
UPDATE "Empresas" SET "ownerId" = (SELECT "id" FROM "User" LIMIT 1) WHERE "ownerId" IS NULL;

-- Now make ownerId required
ALTER TABLE "Empresas" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateTable
CREATE TABLE "EmpresaShare" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "empresaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'viewer',

    CONSTRAINT "EmpresaShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmpresaShare_empresaId_userId_key" ON "EmpresaShare"("empresaId", "userId");

-- AddForeignKey
ALTER TABLE "Empresas" ADD CONSTRAINT "Empresas_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaShare" ADD CONSTRAINT "EmpresaShare_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaShare" ADD CONSTRAINT "EmpresaShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaShare" ADD CONSTRAINT "EmpresaShare_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
