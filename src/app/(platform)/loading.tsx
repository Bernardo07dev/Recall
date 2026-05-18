import Image from "next/image";
import Icon from "../icon.svg";

export default function Loading() {
  return (
    <div className="flex h-full w-full min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        <Image 
          src={Icon} 
          alt="Loading..." 
          width={45} 
          height={45} 
          className="animate-pulse opacity-90" 
        />
        <p className="text-sm text-gray-400 animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
