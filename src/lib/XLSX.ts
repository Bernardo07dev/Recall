import * as XLSX from 'xlsx'

export function lerPlanilha(buffer: ArrayBuffer): string {
    const workbook = XLSX.read(buffer, { type: 'array' })
    
    let resultado = ""

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName]
        const csv = XLSX.utils.sheet_to_csv(sheet)
        resultado += `\n\n=== ABA: ${sheetName} ===\n${csv}`
    })

    return resultado
}