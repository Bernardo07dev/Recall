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
    <div
      className="flex flex-row min-h-screen w-full"
      style={{
        background: 'radial-gradient(at 0% 0%, rgba(21, 101, 192, 0.09) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(155, 89, 182, 0.09) 0px, transparent 55%), radial-gradient(at 10% 50%, rgba(16, 185, 129, 0.065) 0px, transparent 50%), radial-gradient(at 90% 55%, rgba(245, 158, 11, 0.065) 0px, transparent 50%), radial-gradient(at 50% 95%, rgba(236, 72, 153, 0.075) 0px, transparent 55%), #ffffff',
        backgroundAttachment: 'fixed',
      }}
    >
        <SideBar userId={userId}/>
      <div className="relative w-full min-h-screen bg-transparent">
        <nav className="absolute top-0 left-0 z-10 w-full p-4 px-6 flex flex-row justify-between items-center bg-transparent pointer-events-none">
              <div className="pointer-events-auto">
                <Image src={Logo} alt="Logo Totvs" width={70}></Image>
              </div>
              {/* <SupportButton /> */}
          </nav>
          {children}
        </div>
      </div>
  );
}
