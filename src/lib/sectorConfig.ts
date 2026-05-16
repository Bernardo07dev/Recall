import { 
    Building2, Landmark, GraduationCap, Factory, Truck, 
    Laptop, HeartPulse, ShoppingCart, Tractor, Zap, 
    HardHat, Plane, Film, Wifi, Home, Briefcase, 
    Utensils, Car, Newspaper, Pickaxe, Shield
} from 'lucide-react';

export const sectorConfig: Record<string, { Icon: any, textClass: string, bgClass: string }> = {
    "financeiros": { Icon: Landmark, textClass: "text-[#004D99]", bgClass: "bg-[#EFF6FF]" },
    "educação": { Icon: GraduationCap, textClass: "text-[#E2264F]", bgClass: "bg-[#FFF1F2]" },
    "manufatura": { Icon: Factory, textClass: "text-[#16A34A]", bgClass: "bg-[#F0FDF4]" },
    "logística": { Icon: Truck, textClass: "text-[#334155]", bgClass: "bg-[#F1F5F9]" },
    "tecnologia": { Icon: Laptop, textClass: "text-[#9333EA]", bgClass: "bg-[#FAF5FF]" },
    "saúde": { Icon: HeartPulse, textClass: "text-[#DC2626]", bgClass: "bg-[#FEF2F2]" },
    "varejo": { Icon: ShoppingCart, textClass: "text-[#EA580C]", bgClass: "bg-[#FFF7ED]" },
    "agricultura": { Icon: Tractor, textClass: "text-[#65A30D]", bgClass: "bg-[#F7FEE7]" },
    "energia": { Icon: Zap, textClass: "text-[#EAB308]", bgClass: "bg-[#FEFCE8]" },
    "construção": { Icon: HardHat, textClass: "text-[#D97706]", bgClass: "bg-[#FFFBEB]" },
    "turismo": { Icon: Plane, textClass: "text-[#06B6D4]", bgClass: "bg-[#ECFEFF]" },
    "entretenimento": { Icon: Film, textClass: "text-[#db2777]", bgClass: "bg-[#fdf2f8]" },
    "telecomunicações": { Icon: Wifi, textClass: "text-[#4F46E5]", bgClass: "bg-[#EEF2FF]" },
    "imobiliário": { Icon: Home, textClass: "text-[#0D9488]", bgClass: "bg-[#F0FDFA]" },
    "serviços": { Icon: Briefcase, textClass: "text-[#475569]", bgClass: "bg-[#F8FAFC]" },
    "alimentação": { Icon: Utensils, textClass: "text-[#C026D3]", bgClass: "bg-[#FDF4FF]" },
    "transporte": { Icon: Car, textClass: "text-[#2563EB]", bgClass: "bg-[#EFF6FF]" },
    "mídia": { Icon: Newspaper, textClass: "text-[#14B8A6]", bgClass: "bg-[#F0FDFA]" },
    "mineração": { Icon: Pickaxe, textClass: "text-[#78716C]", bgClass: "bg-[#FAFAF9]" },
    "governo": { Icon: Shield, textClass: "text-[#1D4ED8]", bgClass: "bg-[#EFF6FF]" },
};

export const DefaultIconConfig = { Icon: Building2, textClass: "text-gray-600", bgClass: "bg-gray-100" };
