$excel = New-Object -ComObject Excel.Application
$excel.DisplayAlerts = $false
$workbook = $excel.Workbooks.Open("C:\Users\Pedro\.gemini\antigravity\scratch\Planilha MED 1.xlsx")

$allHeaders = @{}

foreach ($sheet in $workbook.Sheets) {
    if ($sheet.Name -in @("Ampla concorrência", "LB_EP", "LB_PPI", "LI_EP", "LI_PPI")) {
        # find the row that has UNIVERSIDADE in C2
        $headerRow = 0
        for($r=1; $r -le 10; $r++) {
            if ($sheet.Cells.Item($r, 2).Text -match "UNIVERSIDADE") {
                $headerRow = $r
                break
            }
        }
        
        $cols = @{}
        for ($c=1; $c -le 25; $c++) {
             $headerText = $sheet.Cells.Item($headerRow, $c).Text
             $aboveHeader = $sheet.Cells.Item($headerRow - 1, $c).Text
             if (-not [string]::IsNullOrWhiteSpace($headerText) -or -not [string]::IsNullOrWhiteSpace($aboveHeader)) {
                 $cols["C$c"] = "$aboveHeader | $headerText"
             }
        }
        $allHeaders[$sheet.Name] = $cols
    }
}

$workbook.Close($false)
$excel.Quit()

$allHeaders | ConvertTo-Json -Depth 4 | Out-File "C:\Users\Pedro\.gemini\antigravity\scratch\headers.json" -Encoding utf8
Write-Output "Done Headers"
