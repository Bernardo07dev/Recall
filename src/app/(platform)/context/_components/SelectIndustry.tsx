import { ChevronDown } from "lucide-react";

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  empytyState?: boolean;
}

export default function SelectIndustry({value, onChange, name, empytyState}: SelectProps) {
  return (
    <div className="w-full flex flex-col mb-6">

      <div className="relative text-[13px]">
        <select
          required 
          className={`w-full py-[11px] px-3 shadow-gray-200 focus:outline-none appearance-none focus-none rounded-lg border-[1.6px] ${empytyState ? 'border-red-400 focus:outline-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : "border-[#C2C6D4]/30 focus:outline-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]'"} bg-white text-gray-700 invalid:text-slate-400`}
          name={name}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled className="text-slate-400">
            Qual o setor
          </option>
          <option value="agricultura" className="text-gray-700">Agricultura</option>
          <option value="alimentação" className="text-gray-700">Alimentação</option>
          <option value="construção" className="text-gray-700">Construção</option>
          <option value="educação" className="text-gray-700">Educação</option>
          <option value="energia" className="text-gray-700">Energia</option>
          <option value="entretenimento" className="text-gray-700">Entretenimento</option>
          <option value="financeiros" className="text-gray-700">Serviços Financeiros</option>
          <option value="governo" className="text-gray-700">Governo</option>
          <option value="imobiliário" className="text-gray-700">Imobiliário</option>
          <option value="logística" className="text-gray-700">Logística</option>
          <option value="manufatura" className="text-gray-700">Manufatura</option>
          <option value="mídia" className="text-gray-700">Mídia</option>
          <option value="mineração" className="text-gray-700">Mineração</option>
          <option value="saúde" className="text-gray-700">Saúde</option>
          <option value="serviços" className="text-gray-700">Serviços</option>
          <option value="tecnologia" className="text-gray-700">Tecnologia</option>
          <option value="telecomunicações" className="text-gray-700">Telecomunicações</option>
          <option value="transporte" className="text-gray-700">Transporte</option>
          <option value="turismo" className="text-gray-700">Turismo</option>
          <option value="varejo" className="text-gray-700">Varejo</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
}