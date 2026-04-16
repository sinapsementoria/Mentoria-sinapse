$excel = New-Object -ComObject Excel.Application
$excel.DisplayAlerts = $false
$workbook = $excel.Workbooks.Open("C:\Users\Pedro\.gemini\antigravity\scratch\Planilha MED 1.xlsx")

$sheetsToProcess = @(
    "Ampla concorrência",
    "LB_EP",
    "LB_PPI",
    "LI_EP",
    "LI_PPI"
)

$targetKeys = @(
    "ampla",
    "lb_ep",
    "lb_ppi",
    "li_ep",
    "li_ppi"
)

$db = @{}

for ($i = 0; $i -lt $sheetsToProcess.Length; $i++) {
    $sheetName = $sheetsToProcess[$i]
    $keyName = $targetKeys[$i]
    
    $sheet = $workbook.Sheets.Item($i + 1)
    $sheetArray = @()
    
    for ($r = 1; $r -le 150; $r++) {
        $c2 = $sheet.Cells.Item($r, 2).Text
        
        if (-not [string]::IsNullOrWhiteSpace($c2) -and $c2 -ne "UNIVERSIDADE" -and $c2 -ne "Sua cidade") {
            if ($c2 -match "OBS:" -or $c2 -match "Obs:") { break }
            
            $c3 = $sheet.Cells.Item($r, 3).Text # Cidade
            $c4 = $sheet.Cells.Item($r, 4).Text # UF
            $c5 = $sheet.Cells.Item($r, 5).Text # KM
            $c6 = $sheet.Cells.Item($r, 6).Text # Regiao
            $c7 = $sheet.Cells.Item($r, 7).Text # Vagas
            
            $c8 = $sheet.Cells.Item($r, 8).Text # RED
            $c9 = $sheet.Cells.Item($r, 9).Text # CN
            $c10 = $sheet.Cells.Item($r, 10).Text # CH
            $c11 = $sheet.Cells.Item($r, 11).Text # LIN
            $c12 = $sheet.Cells.Item($r, 12).Text # MAT
            
            $c16 = $sheet.Cells.Item($r, 16).Text # Corte

            $corteStr = $c16.Trim().Replace(",", ".")
            $corte = $null
            if (-not [string]::IsNullOrWhiteSpace($corteStr) -and $corteStr -notmatch '^-') {
                try { $corte = [double]$corteStr } catch { $corte = $null }
            }

            $parsePeso = {
                param([string]$val)
                $v = $val.Trim().Replace(",", ".")
                if (-not [string]::IsNullOrWhiteSpace($v) -and $v -notmatch '^-') {
                    try { return [double]$v } catch { return 1 }
                }
                return 1
            }

            $pesoRed = &$parsePeso $c8
            $pesoCn = &$parsePeso $c9
            $pesoCh = &$parsePeso $c10
            $pesoLin = &$parsePeso $c11
            $pesoMat = &$parsePeso $c12

            $vagasText = $c7.Trim()
            if ([string]::IsNullOrWhiteSpace($vagasText) -or $vagasText -eq "-") { $vagasText = "0" }

            $obj = [PSCustomObject]@{
                univ = $c2.Trim()
                cidade = $c3.Trim()
                uf = $c4.Trim()
                km = $c5.Trim()
                regiao = $c6.Trim()
                vagas = $vagasText
                pesoRed = $pesoRed
                pesoCn = $pesoCn
                pesoCh = $pesoCh
                pesoLin = $pesoLin
                pesoMat = $pesoMat
                corte = $corte
            }
            $sheetArray += $obj
        }
    }
    
    $db[$keyName] = $sheetArray
}

$workbook.Close($false)
$excel.Quit()

$jsonStr = $db | ConvertTo-Json -Depth 5 -Compress
$finalJs = "// Banco de Dados SISU Extraído Multimodal com tratamento null`r`nconst sisuDB = $jsonStr;"
$finalJs | Out-File "C:\Users\Pedro\.gemini\antigravity\scratch\sisu_data.js" -Encoding utf8
Write-Output "Multimodal Fix Extraction Done"
