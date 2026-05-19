$map = [ordered]@{
    "Ã " = "Á"
    "Ã‰" = "É"
    "Ã " = "Í"
    "Ã“" = "Ó"
    "Ãš" = "Ú"
    "Ã‚" = "Â"
    "ÃŠ" = "Ê"
    "Ã”" = "Ô"
    "Ã…" = "Å"
    "Ãƒ" = "Ã"
    "Ã•" = "Õ"
    "Ã‡" = "Ç"
}

$files = Get-ChildItem -Path $PSScriptRoot\..\..\ -Filter "*.html" -Recurse | Where-Object { $_.Name -notin @("index.html", "login.html", "aluno.html") }

foreach ($file in $files) {
    if (Test-Path $file.FullName) {
        $content = Get-Content -Path $file.FullName -Raw -Encoding String
        $modified = $false
        
        foreach ($bad in $map.Keys) {
            $good = $map[$bad]
            if ($content.Contains($bad)) {
                $content = $content.Replace($bad, $good)
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Fixed $($file.FullName)"
        }
    }
}
