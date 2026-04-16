import sys
import os
import shutil
import argparse

def get_unique_path(dest_folder, filename):
    base, ext = os.path.splitext(filename)
    counter = 1
    new_filepath = os.path.join(dest_folder, filename)
    while os.path.exists(new_filepath):
        new_filepath = os.path.join(dest_folder, f"{base}_v{counter}{ext}")
        counter += 1
    return new_filepath

def main():
    parser = argparse.ArgumentParser(description="Image router deterministic execution for 3-Layer Agent")
    parser.add_argument("--source", required=True, help="Path to the source file in dropzone")
    parser.add_argument("--dest", required=True, help="Destination category name or full relative path inside public/assets/images/")
    args = parser.parse_args()

    if not os.path.exists(args.source):
        print(f"[ERRO] Dropzone file not found: {args.source}")
        sys.exit(1)

    # Base public assets images mapping
    base_dest = os.path.join(os.getcwd(), 'public', 'assets', 'images')
    
    # Check if arg is an absolute subpath or just a generic folder like FOTO REDACOES
    if "/" not in args.dest and "\\" not in args.dest:
        dest_folder = os.path.join(base_dest, args.dest)
    else:
        dest_folder = os.path.join(base_dest, args.dest.strip("\\/"))

    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder, exist_ok=True)
        print(f"[INFO] Created new category folder: {dest_folder}")

    filename = os.path.basename(args.source)
    final_dest_file = get_unique_path(dest_folder, filename)

    try:
        shutil.move(args.source, final_dest_file)
        print(f"[SUCCESS] Moved {args.source} --> {final_dest_file}")
    except Exception as e:
        print(f"[ERRO] Could not move file deterministically. Reason: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
