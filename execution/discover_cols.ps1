$excel = New-Object -ComObject Excel.Application
$excel.DisplayAlerts = $false
$workbook = $excel.Workbooks.Open("C:\Users\Pedro\.gemini\antigravity\scratch\Planilha MED 1.xlsx")

$out = @()
foreach ($sheet in $workbook.Sheets) {
    if ($sheet.Name -in @("Ampla concorrência", "LB_EP", "LB_PPI", "LI_EP", "LI_PPI")) {
        $headerRow = 0
        for($r=1; $r -le 10; $r++) {
            if ($sheet.Cells.Item($r, 2).Text -match "UNIVERSIDADE") {
                $headerRow = $r
                break
            }
        }
        
        $vagasCol = 0
        $corteCol = 0
        
        for ($c=1; $c -le 25; $c++) {
             $headerText = $sheet.Cells.Item($headerRow, $c).Text
             if ($headerText -match "VAGA") { $vagasCol = $c }
             if ($headerText -match "CORTE") { $corteCol = $c }
        }
        $out += "$($sheet.Name) -> Vagas: C$vagasCol, Corte: C$corteCol"
    }
}

$workbook.Close($false)
$excel.Quit()

$out | Out-File "C:\Users\Pedro\.gemini\antigravity\scratch\cols.txt" -Encoding utf8
