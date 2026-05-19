$directoryPath = "c:\Users\Pedro\Downloads\John\Pasta plataforma\src\pages"
$filesToUpdate = Get-ChildItem "$directoryPath\*.html" -File

$replacements = @{
    'Aprovao' = 'Aprovação'
    'comea' = 'começa'
    'construda' = 'construída'
    'Voc' = 'Você'
    'no' = 'não'
    'No' = 'Não'
    'Dirias' = 'Diárias'
    'Estratgia' = 'Estratégia'
    'Mtricas' = 'Métricas'
    'Redao' = 'Redação'
    'Calendrio' = 'Calendário'
    'Leo' = 'Leão'
    'Mdia' = 'Média'
    'mdia' = 'média'
    'Fsica' = 'Física'
    'Matemtica' = 'Matemática'
    'Qumica' = 'Química'
    'Histria' = 'História'
    'Ingesto' = 'Ingestão'
    'Contedo' = 'Conteúdo'
    'Questes' = 'Questões'
    'concluso' = 'conclusão'
    'Concluso' = 'Conclusão'
    'Avaliao' = 'Avaliação'
    'Simulao' = 'Simulação'
    ' aqui' = 'É aqui'
    'Mdulo' = 'Módulo'
    'Sesso' = 'Sessão'
    'Pgina' = 'Página'
    'Usurio' = 'Usuário'
    'Ao' = 'Ação'
    'Informaes' = 'Informações'
    'Lngua' = 'Língua'
    'Redao' = 'Redação'
    'Aprovao' = 'Aprovação'
    'questes' = 'questões'
    'Vocs' = 'Vocês'
    'so' = 'são'
    'Padro' = 'Padrão'
    'Gerao' = 'Geração'
    'Atualizao' = 'Atualização'
    's' = 'às'
    'at' = 'até'
    'At' = 'Até'
    'alm' = 'além'
    'tambm' = 'também'
    'Nvel' = 'Nível'
    'nvel' = 'nível'
    'Geral' = 'Geral' # just in case
    'diria' = 'diária'
    'bsica' = 'básica'
    'Bsica' = 'Básica'
}

$utf8 = [System.Text.Encoding]::UTF8

foreach ($file in $filesToUpdate) {
    if ($file.Name -eq 'update_sidebars.html') { continue }
    
    $content = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    $original = $content
    
    # Process replacements sorted by length descending so larger matches happen first
    $keys = $replacements.Keys | Sort-Object Length -Descending
    foreach ($k in $keys) {
        $content = $content.Replace($k, $replacements[$k])
    }
    
    if ($content -cne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8)
        Write-Host "Restaurado: $($file.Name)"
    }
}
