import { ChevronDown } from "lucide-react";

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
}

export default function SelectIndustry() {
  return (
    <div className="w-full flex flex-col mb-6">

      <div className="relative text-[13px]">
        <select
          required 
          className="w-full py-[11px] px-3 shadow-gray-200 focus:outline-none appearance-none focus-none rounded-lg border-[1.6px] border-[#C2C6D4]/30 bg-white text-gray-700 invalid:text-slate-400"
        
          //   name={name}
        //   value={value}
        //   onChange={onChange}
        >
          <option value="" disabled className="text-slate-400">
            Qual o setor
          </option>
          <option value="analistas" className="text-gray-700">Analista</option>
          <option value="estagio" className="text-gray-700">Estagiário</option>
          <option value="c-level" className="text-gray-700">C-Level</option>
          <option value="suporte" className="text-gray-700">Suporte</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
}