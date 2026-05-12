import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full text-[#1565C0] w-full min-h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-gray-400 font-medium text-muted-foreground animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
