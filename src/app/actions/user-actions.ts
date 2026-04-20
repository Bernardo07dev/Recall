"use server"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function createUser(formData: any) {
  try {
    const newUser = await prisma.user.create({
      data: {
        nome: formData.get("nome"),
        email: formData.get("email"),
        area: formData.get("area"),
        cargo: formData.get("cargo"),
        password: formData.get("password"),
      },
    })

    return { success: true, user: newUser }
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, error: error.message }
  }
}