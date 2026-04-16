const categoryStyles = {
    "Feriado": {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-500",
        solid: "bg-slate-300",
        icon: "directions_run"
    },
    "Letivo": {
        bg: "bg-[#0B193C]/5",
        border: "border-[#0B193C]",
        text: "text-[#0B193C]",
        solid: "bg-[#0B193C]",
        icon: "school"
    },
    "Parcial": {
        bg: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-700",
        solid: "bg-teal-500",
        icon: "app_registration"
    },
    "Completo": {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
        solid: "bg-orange-500",
        icon: "description"
    },
    "Redação": {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-600",
        solid: "bg-rose-500",
        icon: "edit_document"
    },
    "Aulão": {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-600",
        solid: "bg-indigo-500",
        icon: "groups"
    }
};

const categoryNames = {
    "Feriado": "Feriado/Recesso",
    "Letivo": "Período Letivo",
    "Parcial": "Simulado Parcial",
    "Completo": "Simulado Completo",
    "Redação": "Oficina de Redação",
    "Aulão": "Aulão Interdisciplinar"
};

const instEvents = [
    { date: "2026-01-01", type: "Feriado", title: "Confraternização Universal" },
    
    { date: "2026-02-17", type: "Feriado", title: "Carnaval" },
    { date: "2026-02-18", type: "Feriado", title: "Quarta-feira de Cinzas" },
    { date: "2026-02-27", type: "Letivo", title: "Início/Término do período letivo" },
    
    { date: "2026-03-07", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-03-08", type: "Feriado", title: "Dia Internacional da Mulher" },
    { date: "2026-03-21", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-03-28", type: "Parcial", title: "Simulado Parcial" },
    
    { date: "2026-04-03", type: "Feriado", title: "Sexta-feira Santa" },
    { date: "2026-04-04", type: "Parcial", title: "Simulado Parcial" },
    { date: "2026-04-11", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-04-17", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-04-18", type: "Completo", title: "Simulado Completo" },
    { date: "2026-04-21", type: "Feriado", title: "Tiradentes" },
    
    { date: "2026-05-01", type: "Feriado", title: "Dia do Trabalhador" },
    { date: "2026-05-02", type: "Completo", title: "Simulado Completo" },
    { date: "2026-05-09", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-05-16", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-05-23", type: "Aulão", title: "Aulão Interdisciplinar" },
    { date: "2026-05-30", type: "Parcial", title: "Simulado Parcial" },
    
    { date: "2026-06-04", type: "Feriado", title: "Corpus Christi" },
    { date: "2026-06-06", type: "Aulão", title: "Aulão Interdisciplinar" },
    { date: "2026-06-13", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-06-20", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-06-27", type: "Parcial", title: "Simulado Parcial" },
    
    { date: "2026-07-04", type: "Letivo", title: "Término do período letivo" },
    { date: "2026-07-20", type: "Feriado", title: "Recesso Escolar" },
    { date: "2026-07-27", type: "Letivo", title: "Início do período letivo" },
    
    { date: "2026-08-01", type: "Aulão", title: "Aulão Interdisciplinar" },
    { date: "2026-08-08", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-08-09", type: "Feriado", title: "Dia dos Pais" },
    { date: "2026-08-22", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-08-29", type: "Completo", title: "Simulado Completo" },
    
    { date: "2026-09-05", type: "Completo", title: "Simulado Completo" },
    { date: "2026-09-07", type: "Feriado", title: "Independência do Brasil" },
    { date: "2026-09-12", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-09-19", type: "Aulão", title: "Aulão Interdisciplinar" },
    { date: "2026-09-26", type: "Redação", title: "Oficina de Redação" },
    
    { date: "2026-10-03", type: "Aulão", title: "Aulão Interdisciplinar" },
    { date: "2026-10-10", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-10-11", type: "Completo", title: "Simulado Completo" },
    { date: "2026-10-12", type: "Feriado", title: "Nossa Sra. Aparecida" },
    { date: "2026-10-18", type: "Completo", title: "Simulado Completo" },
    { date: "2026-10-24", type: "Redação", title: "Oficina de Redação" },
    { date: "2026-10-31", type: "Aulão", title: "Aulão Interdisciplinar" },
    
    { date: "2026-11-02", type: "Feriado", title: "Finados" },
    { date: "2026-11-14", type: "Letivo", title: "Início/Término do período letivo" },
    
    { date: "2026-12-15", type: "Feriado", title: "Encerramento das Aulas" },
    { date: "2026-12-25", type: "Feriado", title: "Natal" }
].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
