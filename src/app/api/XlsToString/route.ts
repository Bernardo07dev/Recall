import { lerCSVTranscricoes, lerPlanilha } from "@/src/lib/XLSX";

export async function POST(req: Request){
    const { url } = await req.json();
    const response = await fetch(url);
    if (!response.ok) {
        console.log(`Erro ao baixar arquivo: ${url}`);
    }


    console.log("Lendo arquivo de planilha (arrayBuffer)...");

    const buffer = await response.arrayBuffer()
    const tamanhoMB = buffer.byteLength / (1024 * 1024)

    let resultado = ""

    if (tamanhoMB > 10) {
        console.log("Arquivo grande — usando lerCSVTranscricoes...")
        resultado = lerCSVTranscricoes(buffer)
    } else {
        console.log("Arquivo normal — usando lerPlanilha...")
        resultado = lerPlanilha(buffer)
    }

    return new Response(resultado)
}