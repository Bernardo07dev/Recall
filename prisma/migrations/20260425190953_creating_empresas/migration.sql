-- CreateTable
CREATE TABLE "Empresas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "context" TEXT,
    "relation" TEXT,

    CONSTRAINT "Empresas_pkey" PRIMARY KEY ("id")
);
