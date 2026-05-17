import * as XLSX from 'xlsx'

export function lerPlanilha(buffer: ArrayBuffer): string {
    const workbook = XLSX.read(buffer, { 
        type: 'array',
        dense: true,
        cellText: false,
        cellNF: false,
        cellStyles: false,
        sheetRows: 200
    })
    
    let resultado = ""

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]
        
        const preview = json.slice(0, 100)
        const csv = preview.map(row => row.join(", ")).join("\n")
        
        resultado += `\n\n=== ABA: ${sheetName} (${json.length} linhas total) ===\n${csv}`
    })

    return resultado
}

export function lerCSVTranscricoes(buffer: ArrayBuffer): string {
    const workbook = XLSX.read(buffer, { 
        type: 'array',
        dense: true,
        cellText: false,
        cellNF: false,
        cellStyles: false,
    })

    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

    // primeira linha é o cabeçalho
    const headers = json[0]
    console.log("Colunas encontradas:", headers) // loga pra ver os nomes reais

    const rows = json.slice(1) // pula o cabeçalho

    return rows.map((row: any[], index: number) => 
        row.join(" | ")
    ).join("\n")
}