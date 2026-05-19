$directoryPath = "c:\Users\Pedro\Downloads\John\Pasta plataforma\src\pages"
$filesToUpdate = @(
    'mentoria.html', 'metricas.html', 'estrategia.html', 'nexus_provas.html', 
    'provas.html', 'planejamento.html', 'vestibulares.html', 'calendario.html', 
    'simulador.html', 'banco-questoes.html', 'redacao.html', 'flashcard.html', 'perfil.html'
)

$menuItems = @(
    @{ href='mentoria.html'; icon='home'; text='Metas Diárias'; alias=@() },
    @{ href='planejamento.html'; icon='edit_calendar'; text='Planejamento'; alias=@() },
    @{ href='metricas.html'; icon='stacked_line_chart'; text='Meu Desempenho'; alias=@() },
    @{ href='estrategia.html'; icon='route'; text='Estratégia de Aprovação'; alias=@() },
    @{ href='provas.html'; icon='history_edu'; text='Provas'; alias=@('nexus_provas.html') },
    @{ href='vestibulares.html'; icon='school'; text='Vestibulares'; alias=@() },
    @{ href='calendario.html'; icon='calendar_month'; text='Calendário'; alias=@('#calendario') },
    @{ href='simulador.html'; icon='calculate'; text='Simulador SISU'; alias=@() },
    @{ href='banco-questoes.html'; icon='format_list_bulleted'; text='Banco de Questões'; alias=@() },
    @{ href='redacao.html'; icon='edit_document'; text='Redação'; alias=@() },
    @{ href='flashcard.html'; icon='style'; text='Flashcards'; alias=@() },
    @{ href='perfil.html'; icon='person'; text='Perfil'; alias=@() }
)

foreach ($file in $filesToUpdate) {
    $fullPath = Join-Path $directoryPath $file
    if (-Not (Test-Path $fullPath)) {
        Write-Host "[SKIP] missing file: $file"
        continue
    }

    $sidebarHTML = @"
    <aside class="w-[260px] flex flex-col z-30 flex-shrink-0 relative bg-[#153a4c] border-r border-[#102c3a] shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        
        <!-- Logo Area -->
        <div class="pt-10 flex flex-col items-center justify-center shrink-0 mb-10 relative">
            <img src="../../public/imagens/globais/marca/LE%C3%83O%20VETORIZADO.png" alt="Logo Leão" class="w-28 h-28 object-contain mb-2 brightness-200" />
            <h1 class="text-[22px] text-white font-serif-display leading-none tracking-wide text-center">LION<span class="text-white/60 font-light ml-1">MENTORIA</span></h1>
        </div>
        
        <!-- Menu Principal -->
        <nav class="flex-1 overflow-y-auto px-0 space-y-1 relative pb-10 custom-scrollbar">
            
            <div class="mb-4 px-8 mt-2">
                <p class="text-[9px] font-bold text-white/40 uppercase tracking-[0.1em]">Acompanhamento</p>
            </div>
"@

    for ($i = 0; $i -lt $menuItems.Length; $i++) {
        $item = $menuItems[$i]
        $isCurrentActive = ($item.href -eq $file) -or ($item.alias -contains $file)
        
        $marginTop = ""
        if ($i -eq 9 -or $i -eq 11) { $marginTop = " mt-4" }
        
        if ($isCurrentActive) {
            $sidebarHTML += @"
            
            <!-- Active flat pill -->
            <a href="$($item.href)" class="flex items-center gap-4 pl-4 pr-4 py-3 mx-4 bg-white/10 text-white rounded-[12px] font-semibold text-[15px] relative shadow-md shadow-black/10 border border-white/5$marginTop">
                <div class="w-6 flex items-center justify-center">
                    <span class="material-symbols-outlined icon-fill text-[24px] text-white">$($item.icon)</span> 
                </div>
                <span class="tracking-wide">$($item.text)</span>
                <div class="absolute right-4 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
            </a>
"@
        } else {
            $sidebarHTML += @"
            
            <!-- Inactive flat items -->
            <a href="$($item.href)" class="group flex items-center gap-4 pl-6 pr-6 py-3 ml-4 mr-4 text-white/60 hover:text-white hover:bg-white/5 rounded-[12px] transition-all duration-300 font-medium text-[15px]$marginTop">
                <div class="w-6 flex items-center justify-center">
                    <span class="material-symbols-outlined text-[24px] text-white/40 group-hover:text-white/90 transition-colors">$($item.icon)</span> 
                </div>
                <span>$($item.text)</span>
            </a>
"@
        }
    }
    
    $sidebarHTML += @"
        </nav>
    </aside>
"@

    $content = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(?i)<aside[\s\S]*?<\/aside>', $sidebarHTML)
    [System.IO.File]::WriteAllText($fullPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "[SUCCESS] updated aside in $file"
}
