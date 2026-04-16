# SOP: Organização do Inbox de Mídias (Dropzone)

**Objetivo:** Processar o pedido do usuário de classificar e enviar fotos jogadas na pasta temporária `_dropzone_imagens/` para a arquitetura core determinística em `public/imagens/[ALVO]/`.

## Quando rodar esse SOP?
O Agente (LLM) deve ler esta diretriz sempre que o Usuário solicitar "Organize minhas fotos", "Limpa a Dropzone", ou arrastar arquivos e avisar que tem conteúdo de imagem avulso que precisa ser engajado globalmente no projeto.

## O Papel do Agente (Orchestration)
1. Rodar `Get-ChildItem _dropzone_imagens` pelo Powershell para extrair o array de arquivos brutos recém adicionados.
2. Analisar o nome da imagem ou o contexto (Exemplo: "perfil_foo.jpg", "rodrigo_depoimento.png", "redacao-mariana-nota-1000.jpeg").
3. Inferir a categoria correta para cada arquivo. As gavetas ativas no banco `public/imagens/` são:
   - `globais/logos-universidades`
   - `globais/icones`
   - `globais/marca`
   - `landing-page/aprovados`
   - `landing-page/redacoes`
   - `landing-page/hero`
   - `home/avatares`
   - `home/banners-avisos`
   - `questoes/enunciados`
   - `questoes/resolucoes`
   - `questoes/logos-bancas`
4. Se o modelo não tiver certeza, pergunte ao usuário ou coloque numa pasta genérica (ex: `globais/icones`) e sinalize.
5. Se for mapeada em uma das pastas alvo, **iterar sobre a array e engatilhar sucessivas vezes a flag no executor:**
   `python execution/roteador_de_midia.py --source "_dropzone_imagens/foto.jpg" --dest "home/avatares"`

## Restrições 
- O Agente DEVE ler e se assegurar que chamou o roteador pra cada foto listada (processo Batch).
- O Agente DEVE notificar ao fim do Output (via markdown) numa tabela resumida "O que moveu vs Pra Onde" para conforto visual do dev.
