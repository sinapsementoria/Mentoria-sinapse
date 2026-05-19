$directoryPath = "c:\Users\Pedro\Downloads\John\Pasta plataforma\src\pages"
$filesToUpdate = @(
    'mentoria.html', 'metricas.html', 'estrategia.html', 'nexus_provas.html', 
    'provas.html', 'planejamento.html', 'vestibulares.html', 'calendario.html', 
    'simulador.html', 'banco-questoes.html', 'redacao.html', 'flashcard.html', 'perfil.html'
)

$utf8 = [System.Text.Encoding]::UTF8
$win1252 = [System.Text.Encoding]::GetEncoding(1252)

foreach ($file in $filesToUpdate) {
    $fullPath = Join-Path $directoryPath $file
    if (-Not (Test-Path $fullPath)) {
        continue
    }

    $content = [System.IO.File]::ReadAllText($fullPath, $utf8)
    
    # Se j contm "Metas Dirias" corretamente, talvez no esteja corrompido?
    # O arquivo corrompido vai estar como "Metas Diǭrias" ou similar em Win1252
    if ($content -match 'Metas Di.*rias' -and -not ($content -match 'Metas Diárias')) {
        $bytes = $win1252.GetBytes($content)
        $repaired = $utf8.GetString($bytes)
        
        # Save explicitly as UTF8 without BOM (which is usually the safest for web), or just UTF8
        # [System.IO.File]::WriteAllText uses UTF8 without BOM by default in modern .NET / PS Core, but PS 5.1 might use BOM. 
        # For html it's fine.
        [System.IO.File]::WriteAllText($fullPath, $repaired, $utf8)
        Write-Host "Reparado com sucesso: $file"
    } else {
        Write-Host "Pulado ou j reparado: $file"
    }
}
