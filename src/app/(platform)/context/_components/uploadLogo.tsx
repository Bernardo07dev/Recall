import { ImagePlus, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

interface Props {
  logo: File | null;
  setLogo: (file: File | null) => void;
}

export default function UploadLogo({ logo, setLogo }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogo(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div 
      className="w-full h-[46px] border-[1.6px] border-[#C2C6D4]/30 border-dashed rounded-lg hover:bg-[#f3f4fba1] transition-all cursor-pointer flex items-center justify-center relative overflow-hidden"
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        accept="image/*" 
        ref={inputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      {preview ? (
        <div className="flex items-center gap-2 px-3 w-full justify-between">
          <div className="flex items-center gap-2">
            <img src={preview} alt="Logo" className="w-6 h-6 object-cover rounded" />
            <span className="text-xs font-semibold text-gray-600 truncate max-w-[100px]">{logo?.name}</span>
          </div>
          <button onClick={handleRemove} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2 text-gray-400">
          <ImagePlus size={16} />
          <span className="text-[13px]">Faça o upload do logo</span>
        </div>
      )}
    </div>
  );
}