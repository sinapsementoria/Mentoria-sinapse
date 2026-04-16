import json
import re

with open('questoes.json', 'r', encoding='utf-8') as f:
    questoes = json.load(f)

print(f"Total antes: {len(questoes)}")

questoes_limpas = []
for q in questoes:
    enum_text = q.get('enunciado', '').strip()
    
    # 1. Deletar Fantasmas
    if len(enum_text) < 10:
        continue
        
    # 2. Separar Alternativas caso não existam nativamente
    alts = q.get('alternativas', {})
    vazias = all(not str(v).strip() for v in alts.values())
    
    if vazias:
        # Pega todas as linhas não vazias do enunciado
        linhas = [linha for linha in enum_text.split('\n') if linha.strip()]
        
        # Se tiver pelo menos 6 linhas (1 pro enunciado, 5 pras as alternativas)
        if len(linhas) >= 5:
            # Puxa os últimos 5 elementos
            ultimas_cinco = linhas[-5:]
            
            # Limpa qualquer prefixo A) B) falso que tenha ficado se existir
            q['alternativas']['A'] = re.sub(r'^\s*\(?[A-Ea-e]\)?[.\-]?\s+', '', ultimas_cinco[0])
            q['alternativas']['B'] = re.sub(r'^\s*\(?[A-Ea-e]\)?[.\-]?\s+', '', ultimas_cinco[1])
            q['alternativas']['C'] = re.sub(r'^\s*\(?[A-Ea-e]\)?[.\-]?\s+', '', ultimas_cinco[2])
            q['alternativas']['D'] = re.sub(r'^\s*\(?[A-Ea-e]\)?[.\-]?\s+', '', ultimas_cinco[3])
            q['alternativas']['E'] = re.sub(r'^\s*\(?[A-Ea-e]\)?[.\-]?\s+', '', ultimas_cinco[4])
            
            # Reconstrói o enunciado cortando as últimas 5 linhas
            resto = linhas[:-5]
            q['enunciado'] = '\n'.join(resto)

    questoes_limpas.append(q)

print(f"Total depois: {len(questoes_limpas)}")

with open('questoes.json', 'w', encoding='utf-8') as f:
    json.dump(questoes_limpas, f, ensure_ascii=False, indent=4)
