$files = Get-ChildItem -Path . -Recurse | Where-Object { $_.Extension -in ".html", ".js", ".css", ".md", ".json" }

$iso8859 = [System.Text.Encoding]::GetEncoding("iso-8859-1")
$utf8 = New-Object System.Text.UTF8Encoding $false

$c3 = [char]195
$c2 = [char]194

$regexStr = "[$c3$c2]."

foreach ($file in $files) {
    if (Test-Path $file.FullName) {
        $original = Get-Content $file.FullName -Raw -Encoding UTF8
        if ($original -match $regexStr) {
            
            $fixedText = [regex]::Replace($original, $regexStr, {
                param($m)
                $match = $m.Value
                $bytes = $iso8859.GetBytes($match)
                try {
                    $decoded = $utf8.GetString($bytes)
                    if ($decoded.Length -eq 1 -and -not $decoded.Contains([char]65533)) {
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
