import json
import re
import os

try:
    import docx
except ImportError:
    print("A biblioteca python-docx não foi encontrada.")
    print("Por favor, instale executando o comando no terminal:")
    print("pip install python-docx")
    exit()

def extrair_questoes(caminho_arquivo):
    print(f"Abrindo e lendo o documento: {caminho_arquivo}...")
    try:
        doc = docx.Document(caminho_arquivo)
    except Exception as e:
        print(f"Erro ao abrir o arquivo: {e}")
        return []

    questoes = []
    
    questao_atual = None
    texto_buffer = []
    
    # Expressões Regulares para detectar o início de uma questão e as alternativas
    # Ex: "1.", "01 -", "Questão 1"
    regex_questao = re.compile(r'^\s*(?:Questão\s*\d+|\d+\s*[\.\-\)])\s*(.*)', re.IGNORECASE)
    # Ex: "A)", "(B)", "c -", "D."
    regex_alternativa = re.compile(r'^\s*\(?([A-Ea-e])\)?[.\-]?\s+(.*)')

    for para in doc.paragraphs:
        texto = para.text.strip()
        if not texto:
            continue

        # Verifica se é o início de uma nova questão
        match_q = regex_questao.match(texto)
        if match_q:
            # Se já estávamos processando uma questão, salva ela
            if questao_atual:
                if not questao_atual["enunciado"]:
                    questao_atual["enunciado"] = "\n".join(texto_buffer).strip()
                questoes.append(questao_atual)
            
            # Inicializa a nova questão
            questao_atual = {
                "enunciado": "",
                "alternativas": {
                    "A": "", "B": "", "C": "", "D": "", "E": ""
                },
                "disciplina": "",
                "assunto": ""
            }
            texto_buffer = [texto]
            continue
        
        # Se não temos uma questão inicializada ainda, podemos tentar criar uma ao achar a primeira alternativa
        if questao_atual is None:
            match_alt = regex_alternativa.match(texto)
            if match_alt:
                # Cria uma questão genérica (caso não tenha numeração)
                questao_atual = {
                    "enunciado": "\n".join(texto_buffer).strip(),
                    "alternativas": {
                        "A": "", "B": "", "C": "", "D": "", "E": ""
                    },
                    "disciplina": "",
                    "assunto": ""
                }
                letra = match_alt.group(1).upper()
                questao_atual["alternativas"][letra] = match_alt.group(2).strip()
                texto_buffer = []
            else:
                texto_buffer.append(texto)
            continue

        # Já estamos dentro de uma questão
        match_alt = regex_alternativa.match(texto)
        if match_alt:
            # Encontrou uma alternativa
            letra = match_alt.group(1).upper()
            conteudo = match_alt.group(2).strip()
            
            # Fecha o enunciado se for a primeira alternativa encontrada
            if not questao_atual["enunciado"] and texto_buffer:
                questao_atual["enunciado"] = "\n".join(texto_buffer).strip()
                texto_buffer = []
            
            if letra in questao_atual["alternativas"]:
                questao_atual["alternativas"][letra] = conteudo
        else:
            # É texto contínuo. 
            # Pode ser continuação do enunciado ou continuação da última alternativa.
            # Vamos checar se já começamos a preencher alternativas:
            alternativas_preenchidas = [l for l, v in questao_atual["alternativas"].items() if v != ""]
            
            if alternativas_preenchidas:
                # Adiciona na última alternativa cadastrada
                ultima_letra = alternativas_preenchidas[-1]
                questao_atual["alternativas"][ultima_letra] += "\n" + texto
            else:
                # Ainda no enunciado
                texto_buffer.append(texto)

    # Adiciona a última questão processada
    if questao_atual:
        if not questao_atual["enunciado"] and texto_buffer:
            questao_atual["enunciado"] = "\n".join(texto_buffer).strip()
        questoes.append(questao_atual)

    # Limpeza básica (remover alternativas completamente vazias se necessário)
    for q in questoes:
        q["alternativas"] = {k: v for k, v in q["alternativas"].items() if v}

    return questoes

def main():
    pasta_origem = "MATEMATICA SINAPSE"
    nome_arquivo = "Apostila MATEMATICA ENEM MED 2026 (2).docx"
    caminho_completo = os.path.join(pasta_origem, nome_arquivo)
    
    arquivo_saida = "questoes.json"

    if not os.path.exists(caminho_completo):
        print(f"Arquivo não encontrado: {caminho_completo}")
        print("Certifique-se de que o arquivo .docx está nessa pasta com esse nome exato.")
        return

    questoes_extraidas = extrair_questoes(caminho_completo)
    
    if questoes_extraidas:
        try:
            with open(arquivo_saida, 'w', encoding='utf-8') as f:
                json.dump(questoes_extraidas, f, ensure_ascii=False, indent=4)
            print(f"\n✅ Extração concluída com sucesso!")
            print(f"📄 Total de questões encontradas: {len(questoes_extraidas)}")
            print(f"💾 Os dados foram salvos no arquivo '{arquivo_saida}'.")
        except Exception as e:
            print(f"Erro ao salvar o arquivo JSON: {e}")
    else:
        print("\nNenhuma questão pôde ser extraída. O documento pode estar vazio ou a formatação é incompatível.")

if __name__ == "__main__":
    main()
