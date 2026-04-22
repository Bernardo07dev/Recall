import Image from "next/image"
import Logo from "../../../public/Logo-totvs.svg";
import SideBar from "@/src/app/(platform)/_components/SideBar";
import { SupportButton } from "../sign-in/_components/SuporteButton";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex flex-row">
        <SideBar />
        <div className="w-full">
            <nav className="fixed bg-white w-full p-4 px-6 flex flex-row justify-between items-center shadow-sm">
              <Image src={Logo} alt="Logo Recall" width={75}></Image>
              <SupportButton />
          </nav>
          {children}
        </div>
      </div>
  );
}
