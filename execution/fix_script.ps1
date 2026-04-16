$files = Get-ChildItem -Path . -Filter *.html
$rep = @{
    "Ã¡" = "á"; "Ã©" = "é"; "Ã­" = "í"; "Ã³" = "ó"; "Ãº" = "ú";
    "Ã¢" = "â"; "Ãª" = "ê"; "Ã®" = "î"; "Ã´" = "ô"; "Ã»" = "û";
    "Ã£" = "ã"; "Ãµ" = "õ"; "Ã§" = "ç";
    "Ã " = "Á"; "Ã‰" = "É"; "Ã " = "Í"; "Ã“" = "Ó"; "Ãš" = "Ú";
    "Ã‚" = "Â"; "ÃŠ" = "Ê"; "Ã”" = "Ô";
    "Ã…" = "Å"; "Ãƒ" = "Ã"; "Ã•" = "Õ"; "Ã‡" = "Ç";
    "Ã§Ã£o" = "ção"; "Ã§Ãµes" = "ções"; "AprovaÃ§Ã£o" = "Aprovação";
}

$utf8NoBom = New-Object System.Text.UTF8Encoding $False

foreach ($f in $files) {
    if ($f.Name -ne "aluno.html" -and $f.Name -ne "index.html" -and $f.Name -ne "login.html") {
        $path = $f.FullName
        $content = [System.IO.File]::ReadAllText($path)
        
        foreach ($k in $rep.Keys) {
            $content = $content.Replace($k, $rep[$k])
        }
        
        [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
        Write-Output "Processed $($f.Name)"
    }
}
