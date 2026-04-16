$files = Get-ChildItem -Path . -Recurse | Where-Object { $_.Extension -in ".html", ".js", ".json", ".css" } | Select-Object -ExpandProperty FullName

$rep = @{
    "Ã¡" = "á"; "Ã©" = "é"; "Ã­" = "í"; "Ã³" = "ó"; "Ãº" = "ú"
    "Ã¢" = "â"; "Ãª" = "ê"; "Ã®" = "î"; "Ã´" = "ô"; "Ã»" = "û"
    "Ã£" = "ã"; "Ãµ" = "õ"; "Ã§" = "ç"
    "Ã" = "Á"; "Ã‰" = "É"; "Ã" = "Í"; "Ã“" = "Ó"; "Ãš" = "Ú"
    "Ã‚" = "Â"; "ÃŠ" = "Ê"; "Ã”" = "Ô"
    "Ã…" = "Å"; "Ãƒ" = "Ã"; "Ã•" = "Õ"; "Ã‡" = "Ç"
}

foreach ($f in $files) {
    if (Test-Path $f) {
        $c = Get-Content $f -Raw -Encoding UTF8
        foreach ($k in $rep.Keys) {
            $c = $c.Replace($k, $rep[$k])
        }
        Set-Content -Path $f -Value $c -Encoding UTF8
        Write-Output "Fixed Mojibake in $f"
    }
}
