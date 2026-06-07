'use client'
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { sectorConfig, DefaultIconConfig } from "@/src/lib/sectorConfig";

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  empytyState?: boolean;
}

const industries = [
  { value: "agricultura", label: "Agricultura" },
  { value: "alimentação", label: "Alimentação" },
  { value: "construção", label: "Construção" },
  { value: "educação", label: "Educação" },
  { value: "energia", label: "Energia" },
  { value: "entretenimento", label: "Entretenimento" },
  { value: "financeiros", label: "Serviços Financeiros" },
  { value: "governo", label: "Governo" },
  { value: "imobiliário", label: "Imobiliário" },
  { value: "logística", label: "Logística" },
  { value: "manufatura", label: "Manufatura" },
  { value: "mídia", label: "Mídia" },
  { value: "mineração", label: "Mineração" },
  { value: "saúde", label: "Saúde" },
  { value: "serviços", label: "Serviços" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "telecomunicações", label: "Telecomunicações" },
  { value: "transporte", label: "Transporte" },
  { value: "turismo", label: "Turismo" },
  { value: "varejo", label: "Varejo" }
];

export default function SelectIndustry({ value, onChange, name, empytyState }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue: string) => {
    const mockEvent = {
      target: {
        name,
        value: newValue,
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    onChange(mockEvent);
    setOpen(false);
  };

  const selectedIndustry = industries.find((ind) => ind.value === value);
  const config = value ? (sectorConfig[value.toLowerCase()] || DefaultIconConfig) : null;
  const SelectedIcon = config ? config.Icon : null;
  const selectedTextClass = config ? config.textClass : "text-gray-400";
  const selectedBgClass = config ? config.bgClass : "bg-transparent";

  return (
    <div className="w-full flex flex-col mb-6 relative text-[0.75rem]" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full text-left flex items-center justify-between border-[1.6px] rounded-lg transition-all  py-[11px] px-3 bg-white cursor-pointer focus:outline-none ${
          empytyState
            ? 'border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
            : open
              ? 'border-sky-500 shadow-[0_0_0_4px_rgba(14,165,233,0.15)]'
              : 'border-[#C2C6D4]/30 hover:border-gray-400/50'
        }`}
      >
        <div className="flex items-center gap-2">
          {config && SelectedIcon ? (
            <>
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${selectedBgClass}`}>
                <SelectedIcon size={12} className={selectedTextClass} />
              </div>
              <span className="text-gray-700 font-semibold">
                {selectedIndustry ? selectedIndustry.label : value}
              </span>
            </>
          ) : (
            <span className="text-gray-400 ">Qual o setor</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-[105%] left-0 z-50 w-full bg-white border border-gray-200/80 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1.5 animate-fade-in">
          {industries.map((industry) => {
            const indConfig = sectorConfig[industry.value] || DefaultIconConfig;
            const { Icon: IndIcon, textClass: indTextClass, bgClass: indBgClass } = indConfig;
            const isSelected = value === industry.value;

            return (
              <div
                key={industry.value}
                onClick={() => handleSelect(industry.value)}
                className={`flex items-center gap-2 px-3 py-2 text-[0.6875rem] font-medium cursor-pointer hover:bg-blue-50/40 transition-colors ${
                  isSelected ? 'text-blue-500 bg-blue-50/50' : 'text-gray-700'
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${indBgClass}`}>
                  <IndIcon size={12} className={indTextClass} />
                </div>
                <span>{industry.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}