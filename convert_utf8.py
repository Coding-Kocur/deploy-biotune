import glob
import chardet

files = glob.glob('*.html')
for f in files:
    with open(f, 'rb') as file:
        raw = file.read()
    
    # Try decoding as utf-8 first
    try:
        raw.decode('utf-8')
        # It's already valid UTF-8, no action needed unless we want to fix specific mojibake like before
        continue
    except UnicodeDecodeError:
        # File is not UTF-8! It's likely cp1250 or windows-1252
        doc_encoding = chardet.detect(raw)['encoding']
        print(f"{f} is encoded as {doc_encoding}. Converting to UTF-8...")
        
        # fallback chain for Polish
        content = None
        for enc in ['cp1250', 'iso-8859-2', 'windows-1252']:
            try:
                content = raw.decode(enc)
                break
            except Exception:
                pass
                
        if content:
            with open(f, 'w', encoding='utf-8') as out_file:
                out_file.write(content)
            print(f"Successfully converted {f} to UTF-8.")
