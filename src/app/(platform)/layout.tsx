import Image from "next/image"
import Logo from "../../../public/Logo-totvs.svg";
import SideBar from "@/src/app/(platform)/_components/SideBar";
import { SupportButton } from "../sign-in/_components/SuporteButton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/src/lib/auth";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("recall-session")?.value;

  if (!token) {
    redirect("/log-in");
  }

  let userId = "";

  try {
    const session = await decrypt(token);
    userId = session.userId as string;
  } catch (error) {
    redirect("/api/logout");
  }

  return (
      <div className="flex flex-row">
        <SideBar userId={userId}/>
        <div className="w-full bg-[#fbfbff]">
            <nav className="fixed z-5 w-full p-4 px-6 flex flex-row justify-between items-center" style={{ background: 'linear-gradient(to bottom, #fbfbff, transparent)' }}>
              <Image src={Logo} alt="Logo Totvs" width={70}></Image>
              {/* <SupportButton /> */}
          </nav>
          {children}
        </div>
      </div>
  );
}
