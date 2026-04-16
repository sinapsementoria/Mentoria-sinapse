import json
import re
import os

try:
    import docx
    from docx.document import Document
    from docx.table import _Cell, Table
    from docx.text.paragraph import Paragraph
    from docx.oxml.table import CT_Tbl
    from docx.oxml.text.paragraph import CT_P
except ImportError:
    print("A biblioteca python-docx não foi encontrada.")
    print("Por favor, instale executando o comando no terminal:")
    print("pip install python-docx")
    exit()

image_counter = 1

def save_image(image_part, img_dir):
    global image_counter
    try:
        content_type = image_part.content_type
        ext = 'png'
        if 'jpeg' in content_type or 'jpg' in content_type:
            ext = 'jpg'
        elif 'gif' in content_type:
            ext = 'gif'
            
        img_name = f"image_{image_counter:04d}.{ext}"
        filepath = os.path.join(img_dir, img_name)
        
        # Só salva se não existir com mesmo nome para não sobrepor? 
        # O contador garante ser único.
        with open(filepath, 'wb') as f:
            f.write(image_part.blob)
        
        image_counter += 1
        return img_name
    except Exception as e:
        print(f"Erro ao salvar imagem: {e}")
        return None

def extract_images_from_paragraph(para, doc, img_dir):
    images = []
    rels = doc.part.rels
    
    # 1. Procura por Inline Shapes normais (w:drawing)
    for drawing in para._element.xpath('.//w:drawing'):
        for blip in drawing.xpath('.//a:blip'):
            embed_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            if embed_id and embed_id in rels:
                image_part = rels[embed_id].target_part
                img_name = save_image(image_part, img_dir)
                if img_name:
                    images.append(img_name)
                    
    # 2. Procura por Shapes antigas/flutuantes (v:shape / w:pict)
    for pict in para._element.xpath('.//w:pict'):
        # Utilizando local-name() para evitar problemas com namespace 'v' não registrado no python-docx
        for imagedata in pict.xpath('.//*[local-name()="imagedata"]'):
            embed_id = imagedata.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
            if embed_id and embed_id in rels:
                image_part = rels[embed_id].target_part
                img_name = save_image(image_part, img_dir)
                if img_name:
                    images.append(img_name)
                    
    return images

def iter_block_items(parent):
    """
    Função utilitária avançada para iterar por TODOS os blocos (Parágrafos E Tabelas)
    preservando a ordem de leitura.
    """
    if isinstance(parent, Document):
        parent_elm = parent.element.body
    elif isinstance(parent, _Cell):
        parent_elm = parent._tc
    else:
        parent_elm = parent

    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)

def get_elements_in_order(doc):
    elements = []
    def walk(parent):
        for block in iter_block_items(parent):
            if isinstance(block, Paragraph):
                elements.append(block)
            elif isinstance(block, Table):
                # Achata a tabela lendo linha por linha, célula por célula
                for row in block.rows:
                    for cell in row.cells:
                        walk(cell)
    walk(doc)
    return elements

def extrair_questoes(caminho_arquivo, img_dir):
    print(f"Abrindo e lendo o documento: {caminho_arquivo}...")
    try:
        doc = docx.Document(caminho_arquivo)
    except Exception as e:
        print(f"Erro ao abrir o arquivo: {e}")
        return []

    # Cria a pasta de imagens
    if not os.path.exists(img_dir):
        os.makedirs(img_dir)

    elements = get_elements_in_order(doc)
    print(f"Foram encontrados {len(elements)} blocos de texto/tabelas no documento.")

    questoes = []
    
    questao_atual = None
    texto_buffer = []
    imagens_buffer = []
    
    assunto_atual = "A Definir"
    disciplina_atual = "Matemática"

    # Regex SUPER TOLERANTE para identificar início de questão
    regex_questao = re.compile(r'^\s*(?:QUEST[AÃÁ]O\s*\d+|(?:Q)?\d+\s*[\.\-\)])\s*(.*)', re.IGNORECASE)
    # Regex para alternativas "A)", "(B)", "c -", "D."
    regex_alternativa = re.compile(r'^\s*\(?([A-Ea-e])\)?[.\-]?\s+(.*)')
    # Regex para extrair Títulos baseados no formato da Apostila (ex: Aula 01: Função polinomial)
    regex_aula = re.compile(r'^\s*Aulas?\s*\d+(?:\s*e\s*\d+)?\s*:\s*(.*)', re.IGNORECASE)

    def salvar_questao_atual():
        if questao_atual:
            # Se não tínhamos fechado o enunciado
            if not questao_atual["enunciado"] and texto_buffer:
                questao_atual["enunciado"] = "\n".join(texto_buffer).strip()
            
            questao_atual["imagem_anexa"] = ", ".join(imagens_buffer)
            # Remove alternativas vazias
            questao_atual["alternativas"] = {k: v for k, v in questao_atual["alternativas"].items() if v}
            questoes.append(questao_atual)

    for block in elements:
        texto = block.text.strip()
        imagens_bloco = extract_images_from_paragraph(block, doc, img_dir)

        if not texto and not imagens_bloco:
            continue
            
        # Tenta casar o cabeçalho de aula para definir o Assunto
        match_aula = regex_aula.match(texto)
        if match_aula:
            assunto_atual = match_aula.group(1).strip()
            continue

        # Verifica se é uma nova questão
        match_q = regex_questao.match(texto)
        if match_q:
            salvar_questao_atual()
            
            # Inicializa a nova questão
            questao_atual = {
                "enunciado": "",
                "alternativas": {"A": "", "B": "", "C": "", "D": "", "E": ""},
                "imagem_anexa": "",
                "disciplina": disciplina_atual,
                "assunto": assunto_atual
            }
            texto_inicial = match_q.group(1).strip()
            texto_buffer = [texto_inicial] if texto_inicial else []
            imagens_buffer = imagens_bloco
            continue
        
        # Se não abriu uma questão, mas achou uma Alternativa, cria de forma genérica
        if questao_atual is None:
            match_alt = regex_alternativa.match(texto)
            if match_alt:
                questao_atual = {
                    "enunciado": "\n".join(texto_buffer).strip(),
                    "alternativas": {"A": "", "B": "", "C": "", "D": "", "E": ""},
                    "imagem_anexa": ", ".join(imagens_buffer),
                    "disciplina": disciplina_atual,
                    "assunto": assunto_atual
                }
                letra = match_alt.group(1).upper()
                questao_atual["alternativas"][letra] = match_alt.group(2).strip()
                texto_buffer = []  # Esvazia o buffer pois virou enunciado
                imagens_buffer = imagens_bloco
            else:
                if texto: texto_buffer.append(texto)
                imagens_buffer.extend(imagens_bloco)
            continue

        # Já estamos dentro de uma questão
        match_alt = regex_alternativa.match(texto)
        if match_alt:
            letra = match_alt.group(1).upper()
            conteudo = match_alt.group(2).strip()
            
            # Fecha o enunciado se é a primeira alternativa encontrada
            if not questao_atual["enunciado"] and texto_buffer:
                questao_atual["enunciado"] = "\n".join(texto_buffer).strip()
                texto_buffer = []
            
            if letra in questao_atual["alternativas"]:
                questao_atual["alternativas"][letra] = conteudo
                
            # Imagens achadas na linha da alternativa jogamos no pool da questão
            imagens_buffer.extend(imagens_bloco)
        else:
            # Texto contínuo ou Imagem contínua
            imagens_buffer.extend(imagens_bloco)
            
            if texto:
                alternativas_preenchidas = [l for l, v in questao_atual["alternativas"].items() if v != ""]
                if alternativas_preenchidas:
                    ultima_letra = alternativas_preenchidas[-1]
                    questao_atual["alternativas"][ultima_letra] += "\n" + texto
                else:
                    texto_buffer.append(texto)

    # Salva a última do buffer
    salvar_questao_atual()

    return questoes

def main():
    pasta_origem = "MATEMATICA SINAPSE"
    nome_arquivo = "Apostila MATEMATICA ENEM MED 2026 (2).docx"
    caminho_completo = os.path.join(pasta_origem, nome_arquivo)
    
    pasta_imagens = "imagens_extraidas"
    arquivo_saida = "questoes.json"

    if not os.path.exists(caminho_completo):
        print(f"Arquivo não encontrado: {caminho_completo}")
        print("Certifique-se de que o arquivo docx está na pasta 'MATEMATICA SINAPSE'.")
        return

    global image_counter
    image_counter = 1

    print("Iniciando varredura aprofundada (texto, tabelas e imagens inline)...")
    questoes_extraidas = extrair_questoes(caminho_completo, pasta_imagens)
    
    if questoes_extraidas:
        try:
            with open(arquivo_saida, 'w', encoding='utf-8') as f:
                json.dump(questoes_extraidas, f, ensure_ascii=False, indent=4)
            print(f"\n✅ REATORAÇÃO CONCLUÍDA COM SUCESSO!")
            print(f"📄 Questões mapeadas de ponta a ponta: {len(questoes_extraidas)}")
            print(f"🖼️ Imagens extraídas e salvas na pasta: {pasta_imagens}/")
            print(f"💾 O JSON estruturado final está no arquivo: '{arquivo_saida}'")
        except Exception as e:
            print(f"Erro ao salvar arquivo JSON: {e}")
    else:
        print("\nNenhuma questão pôde ser extraída. O formato ainda pode estar ilegível.")

if __name__ == "__main__":
    main()
