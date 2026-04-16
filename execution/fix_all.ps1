$files = Get-ChildItem -Path . -Recurse | Where-Object { $_.Extension -in ".html", ".js", ".css", ".md", ".json" }

$iso8859 = [System.Text.Encoding]::GetEncoding("iso-8859-1")
$utf8 = New-Object System.Text.UTF8Encoding $false # no BOM

foreach ($file in $files) {
    if (Test-Path $file.FullName) {
        $original = Get-Content $file.FullName -Raw -Encoding UTF8
        if ($original -match "[ÃÂ]") {
            $changed = $false
            
            $fixedText = [regex]::Replace($original, '[ÃÂ].', {
                param($m)
                $match = $m.Value
                $bytes = $iso8859.GetBytes($match)
                try {
                    $decoded = $utf8.GetString($bytes)
                    # Exclude the Unicode replacement character
                    if (-not $decoded.Contains([char]0xFFFD)) {
                        return $decoded
                    }
                } catch {}
                return $match
            })
            
            if ($fixedText -cne $original) {
                Set-Content -Path $file.FullName -Value $fixedText -Encoding UTF8
                Write-Output "Fixed Mojibake in $($file.Name)"
            }
        }
    }
}
