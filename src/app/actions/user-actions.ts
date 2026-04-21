"use server"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { error } from "console";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function createUser(prevState: any, formData: any) {
  const password = formData.get("password")

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await prisma.user.create({
      data: {
        nome: formData.get("nome"),
        email: formData.get("email"),
        area: formData.get("area"),
        cargo: formData.get("cargo"),
        password: hashedPassword,
      },
    })

    return { success: true, user: newUser }
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, error: error.message }
  }

}

export async function loginUser(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return { success: false,  error: "E-mail ou senha inválidos"};
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return { success: false,  error: "E-mail ou senha inválidos"};
    }
}