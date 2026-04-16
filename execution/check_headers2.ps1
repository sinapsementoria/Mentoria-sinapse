$excel = New-Object -ComObject Excel.Application
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Open("C:\Users\Pedro\.gemini\antigravity\scratch\Planilha MED 1.xlsx")
$sh = $wb.Sheets.Item(1)
$out = @()
for($i=1; $i -le 25; $i++) {
    $v1 = $sh.Cells.Item(5, $i).Text
    $v2 = $sh.Cells.Item(6, $i).Text
    $out += "C$i: $v1 | $v2"
}
$wb.Close($false)
$excel.Quit()
$out | Out-File "C:\Users\Pedro\.gemini\antigravity\scratch\ampla_headers.txt" -Encoding utf8
