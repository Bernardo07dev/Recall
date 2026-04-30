"use server"
import bcrypt from 'bcryptjs';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { encrypt } from "@/src/lib/auth";
import { supabase } from "@/src/lib/supabase";
import { executeGraph } from '@/src/lib/langchain/actionsAI';

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

    redirect("/chat");
}

export async function createEmpresa(prevState: any, form: FormData) {
  try {
      const newBusiness = await prisma.empresas.create({
          data: {
            nome: form.get("nome") as string,
            content: form.get("content") as string,
            industry: form.get("industria") as string,
        }
      });
    
      const files = form.getAll("arquivos") as File[]
      const logo = form.get("logo") as File | null;
      const links: string[] = []
      let logoUrl: string | null = null;

      if (logo && logo.size > 0) {
        const pathLogo = `logo/${newBusiness.id}/${logo.name}`
        const bytes = await logo.arrayBuffer()
        const buffer = Buffer.from(bytes)
        try {
            const { error } = await supabase.storage
                .from("empresas")
                .upload(pathLogo, buffer, {
                    contentType: logo.type,
                    upsert: true
                });
                
            if (!error) {
                const { data } = supabase.storage
                    .from("empresas")
                    .getPublicUrl(pathLogo);
                logoUrl = data.publicUrl;
            }
        } catch (error) {
            console.log(error)
        }
      }

      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const path = `${newBusiness.id}/${file.name}`

        const { error } = await supabase.storage
            .from("empresas")
            .upload(path, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (error) throw error

        const { data } = supabase.storage
            .from("empresas")
            .getPublicUrl(path)

        links.push(data.publicUrl)
      }

      const updatedBusiness = await prisma.empresas.update({
          where: { id: newBusiness.id },
          data: { 
              files: links,
              logo: logoUrl
          }
      });

      (async () => {
          try {
              await executeGraph(newBusiness.id, links)
              await prisma.empresas.update({
                  where: { id: newBusiness.id },
                  data: { status: "ready" }
              })
          } catch (error) {
              console.error("Erro na IA:", error)
              await prisma.empresas.update({
                  where: { id: newBusiness.id },
                  data: { status: "error" }
              })
          }
      })();

      return { success: true, empresa: updatedBusiness };
  } catch (error: any) {
        console.error("Erro ao criar empresa:", error);
        return { success: false, error: error.message };
  }
}