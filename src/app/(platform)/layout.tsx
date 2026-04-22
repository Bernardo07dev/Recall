import Image from "next/image"
import Logo from "../../../public/RECALL-logo.svg";
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
        <div className="">
            <nav className="fixed z-4 bg-white w-full p-4 px-10 flex flex-row justify-between items-center shadow-md">
              <Image src={Logo} alt="Logo Recall" width={70}></Image>
              <SupportButton />
          </nav>
          {children}
        </div>
      </div>
  );
}
