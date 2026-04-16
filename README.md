# Sinapse Pré-Med 🧠

Bem-vindo ao repositório oficial da plataforma **Sinapse Pré-Med**, uma solução educacional hiper-dinâmica voltada para a preparação de estudantes para os cursos de Medicina e eixos de alta concorrência universitária.

Neste ecossistema oferecemos o Portal do Professor, Espaço Analítico do Aluno e Ferramentas massivas de Cronogramas, Flashcards (Spaced Repetition) e Bancos de Questões.

## Arquitetura do Projeto

O projeto adota uma arquitetura híbrida ultra-moderna de alto desempenho separada em duas rotas vitais:

1. **Frontend Otimizado (Vanilla Web):**
   * Interface construída pura na fundação da Web (HTML/JS/CSS), com estilizações Tailwind CDN para renderização em tempo real sem complexidade de builds engessadas (como React/Next Node).
   * **`public/`**: Guarda estático o arsenal de centenas de imagens nativas (`assets/images`) e nossas planilhas/dados em base local.
   * **`src/`**: Todos os componentes lógicos das rotas e das telas do aluno (Dashboards e ferramentas).

2. **Backend Determinístico (The 3-Layer Architect AI Agent):**
   * O projeto roda sob orquestração automatizada de Inteligência Artificial usando a diretriz do "Pasta-Org".
   * A gestão pesada não existe no frontend. O scraping e processamento de imagem funcionam em camadas assíncronas puramente baseados em Python.
   * **`directives/`**: SOPs e Regras para a Inteligência Artificial.
   * **`execution/`**: Onde as engrenagens brutas automatizadas de fato atuam no processamento dos dados do projeto.
   * **`.tmp/` e `_dropzone_imagens/`**: Ambientes de quarentena provisória blindadas pelo git.

## Equipe
Construído e idealizado para a revolução do Ensino particular de alto nível.
* **Akili:** Assistente Inteligente Oficial On-page e Co-Piloto Institucional.
