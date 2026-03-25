import glob

directory = 'C:/Users/stani/.gemini/antigravity/scratch'

for filepath in glob.glob(f'{directory}/**/*.html', recursive=True):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Corrupted arrows
        content = content.replace('â† ', '← ')
        content = content.replace('â†', '← ')
        
        # Corrupted SIĘ
        content = content.replace('SIÄ˜', 'SIĘ')
        
        if original_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed encoding in {filepath}')
    except Exception as e:
        print(f'Error processing {filepath}: {e}')
