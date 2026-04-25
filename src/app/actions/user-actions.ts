"use server"
import bcrypt from 'bcryptjs';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { encrypt } from "@/src/lib/auth";

export async function createUser(prevState: any, formData: any) {
  const password = formData.get("password");

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

    const sessionToken = await encrypt({ userId: newUser.id, nome: newUser.nome });

    const cookieStore = await cookies();

    cookieStore.set("recall-session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    return { success: true, user: newUser}
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

    const cookieStore = await cookies();
    const sessionToken = await encrypt({ userId: user.id, nome: user.nome });

    cookieStore.set("recall-session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });

    redirect("/dashboard");
}