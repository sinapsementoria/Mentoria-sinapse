import os
import shutil

# Root directory of the project
project_root = r"c:\Users\Pedro\Downloads\John\Pasta plataforma"

# Mapping (old_path, new_path)
path_mappings = [
    # Global Logos - VESTIBULARES
    ("public/assets/images/VESTIBULARES", "public/imagens/globais/logos-universidades"),
    # Global Logos - Bancas
    ("public/assets/images/PROVAS ENEM", "public/imagens/questoes/logos-bancas/PROVAS ENEM"),
    ("public/assets/images/NEXUS PROVAS", "public/imagens/questoes/logos-bancas/NEXUS PROVAS"),
    # Marca
    ("public/assets/images/LOGO SINAPSE FINAL.jpeg", "public/imagens/globais/marca/LOGO SINAPSE FINAL.jpeg"),
    ("public/assets/images/LOGO SINAPSE FUNDO PRETO FINAL.png", "public/imagens/globais/marca/LOGO SINAPSE FUNDO PRETO FINAL.png"),
    ("public/assets/images/LOGO SINAPSE.jpeg", "public/imagens/globais/marca/LOGO SINAPSE.jpeg"),
    ("public/assets/images/LOGO VETORIZADA MENTORIA.png", "public/imagens/globais/marca/LOGO VETORIZADA MENTORIA.png"),
    ("public/assets/images/LOGO VETORIZADA.png", "public/imagens/globais/marca/LOGO VETORIZADA.png"),
    ("public/assets/images/MENTORIA SINAPSE.jpeg", "public/imagens/globais/marca/MENTORIA SINAPSE.jpeg"),
    ("public/assets/images/SINASPRIME.jpeg", "public/imagens/globais/marca/SINASPRIME.jpeg"),
    ("public/assets/images/LEAO.jpeg", "public/imagens/globais/marca/LEAO.jpeg"),
    ("public/assets/images/LEÃO VETORIZADO.png", "public/imagens/globais/marca/LEÃO VETORIZADO.png"),
    # Avatares / Icones
    ("public/assets/images/akili_avatar.png", "public/imagens/globais/icones/akili_avatar.png"),
    ("public/assets/images/PERFIL", "public/imagens/home/avatares"),
    # Hero / Banners / Backgrounds
    ("public/assets/images/FOTO 1 INDEX.png", "public/imagens/landing-page/hero/FOTO 1 INDEX.png"),
    ("public/assets/images/FOTO 2 INDEX.png", "public/imagens/landing-page/hero/FOTO 2 INDEX.png"),
    ("public/assets/images/CAPA DO VIDEO", "public/imagens/landing-page/hero/CAPA DO VIDEO"),
    ("public/assets/images/metodologia.png", "public/imagens/landing-page/hero/metodologia.png"),
    # Aprovados / Depoimentos
    ("public/assets/images/DEPOIMENTO", "public/imagens/landing-page/aprovados"),
    # Redaçoes
    ("public/assets/images/FOTO REDACOES", "public/imagens/landing-page/redacoes"),
    # Resolucões (Cartões de resposta)
    ("public/assets/images/CARTOES DE RSPOSTAS", "public/imagens/questoes/resolucoes/CARTOES DE RESPOSTAS"),
    # Fundos
    ("public/assets/images/fundo administrativo.png", "public/imagens/home/banners-avisos/fundo administrativo.png"),
    ("public/assets/images/fundo espaço do aluno.png", "public/imagens/home/banners-avisos/fundo espaço do aluno.png"),
    ("public/assets/images/fundo-aluno.png", "public/imagens/home/banners-avisos/fundo-aluno.png"),
    ("public/assets/images/MATEMATICA SINAPSE", "public/imagens/landing-page/hero/MATEMATICA SINAPSE"),
    ("public/assets/images/imagens_extraidas", "public/imagens/questoes/enunciados/imagens_extraidas"),
]

string_replacements = []
# Sort mappings by length descending so longer paths match first (e.g. nested folders over parents if any conflict)
for old_rel, new_rel in sorted(path_mappings, key=lambda x: len(x[0]), reverse=True):
    old_segment = old_rel.replace("public/assets/images", "assets/images")
    new_segment = new_rel.replace("public/imagens", "imagens")
    string_replacements.append((old_segment, new_segment))
    
    old_segment_pub = old_rel
    new_segment_pub = new_rel
    string_replacements.append((old_segment_pub, new_segment_pub))

    old_segment_encode = old_segment.replace(" ", "%20")
    new_segment_encode = new_segment.replace(" ", "%20")
    if old_segment_encode != old_segment:
        string_replacements.append((old_segment_encode, new_segment_encode))

def process_file_replacements():
    files_to_check = []
    
    for root, dirs, files in os.walk(project_root):
        if ".git" in root or "node_modules" in root or ".tmp" in root or "execution" in root or "directives" in root:
            continue
        for f in files:
            if f.endswith(".html") or f.endswith(".css") or f.endswith(".js"):
                files_to_check.append(os.path.join(root, f))
                
    for fpath in files_to_check:
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            orig_content = content
            for old_str, new_str in string_replacements:
                content = content.replace(old_str, new_str)
                
            if content != orig_content:
                with open(fpath, 'w', encoding='utf-8', newline='') as f:
                    f.write(content)
                print(f"Updated {fpath}")
        except Exception as e:
            print(f"Failed to read/write {fpath}: {e}")

def process_file_moves():
    for old_rel, new_rel in path_mappings:
        src = os.path.join(project_root, old_rel.replace("/", os.sep))
        dst = os.path.join(project_root, new_rel.replace("/", os.sep))
        
        if os.path.exists(src):
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if os.path.isdir(src):
                if not os.path.exists(dst):
                    shutil.copytree(src, dst)
                    shutil.rmtree(src)
                    print(f"Moved directory {src} to {dst}")
                else:
                    for item in os.listdir(src):
                        s = os.path.join(src, item)
                        d = os.path.join(dst, item)
                        if not os.path.exists(d):
                            shutil.move(s, d)
                    try:
                        shutil.rmtree(src)
                        print(f"Moved directory contents {src} into existing {dst}")
                    except Exception:
                        pass
            else:
                if not os.path.exists(dst):
                    shutil.move(src, dst)
                    print(f"Moved file {src} to {dst}")
        else:
            print(f"Source not found: {src}")

if __name__ == "__main__":
    print("Starting replacements...")
    process_file_replacements()
    print("Starting moves...")
    process_file_moves()
    print("Done.")
