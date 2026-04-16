$files = @(
    "mentoria.html",
    "metricas.html",
    "provas.html",
    "simulador.html",
    "calendario.html",
    "banco-questoes.html"
)

$menuObj = @(
    @{ text="Metas DiÃ¡rias"; icon="home"; href="mentoria.html" },
    @{ text="Meu Desempenho"; icon="trending_up"; href="metricas.html" },
    @{ text="RevisÃµes EstratÃ©gicas"; icon="history_edu"; href="provas.html" },
    @{ text="CalendÃ¡rio"; icon="calendar_month"; href="calendario.html" },
    @{ text="Simulador SISU"; icon="calculate"; href="simulador.html" },
    @{ text="Banco de QuestÃµes"; icon="checklist"; href="banco-questoes.html" }
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw
        
        $startMatch = '<nav class="flex-1 overflow-y-auto py-8 px-6 space-y-2">'
        $endMatch = '</nav>'
        
        $startIdx = $content.IndexOf($startMatch)
        if ($startIdx -ge 0) {
            $endIdx = $content.IndexOf($endMatch, $startIdx)
            if ($endIdx -ge 0) {
                
                $navHtml = "`n            <p class=`"text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mb-4 pl-3`">Acompanhamento</p>`n"
                
                foreach ($item in $menuObj) {
                    $isActive = ($item.href -eq $f)
                    if ($isActive) {
                        $navHtml += "            <a href=`"$($item.href)`" class=`"flex items-center gap-4 px-4 py-3 bg-[#0B193C] text-white rounded-xl font-semibold shadow-lg shadow-[#0B193C]/20 transition-all hover:scale-[1.02]`">`n"
                        $navHtml += "                <span class=`"material-symbols-outlined icon-fill opacity-90 text-[22px]`">$($item.icon)</span> $($item.text)`n"
                        $navHtml += "                <div class=`"ml-auto w-1.5 h-1.5 rounded-full bg-sinapse-primary animate-pulse`"></div>`n"
                        $navHtml += "            </a>`n"
                    } else {
                        $navHtml += "            <a href=`"$($item.href)`" class=`"flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-[#0B193C] hover:bg-slate-50/80 rounded-xl transition-all font-medium group`">`n"
                        $navHtml += "                <span class=`"material-symbols-outlined opacity-70 group-hover:opacity-100 text-[22px] transition-opacity`">$($item.icon)</span> $($item.text)`n"
                        $navHtml += "            </a>`n"
                    }
                }
                
                $pre = $content.Substring(0, $startIdx + $startMatch.Length)
                $post = $content.Substring($endIdx)
                $newContent = $pre + $navHtml + '        ' + $post
                
                Set-Content -Path $f -Value $newContent -Encoding UTF8
                Write-Output "Updated $f"
            }
        }
    }
}

