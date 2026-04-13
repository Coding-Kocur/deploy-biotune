import glob

files = glob.glob('*.html')
replacements = {
    'Ä…': 'ą', 'Ä‡': 'ć', 'Ä™': 'ę', 'Ĺ‚': 'ł', 'Ĺ„': 'ń', 'Ăł': 'ó', 
    'Ĺ›': 'ś', 'Ĺş': 'ź', 'Ĺż': 'ż', 'ĹĽ': 'ż',
    'Ä„': 'Ą', 'Ä†': 'Ć', 'Ä˜': 'Ę', 'Ĺ ': 'Ł', 'Ĺƒ': 'Ń', 'Ă“': 'Ó', 
    'Ĺš': 'Ś', 'ĹŠ': 'Ś', 'Ĺą': 'Ź', 'Ĺť': 'Ż', 'SIÄ˜': 'SIĘ', 
    'WIADOMOĹšÄ†': 'WIADOMOŚĆ', 'WYĹšLIJ': 'WYŚLIJ', 'WYĹŠLIJ': 'WYŚLIJ',
    'WIADOMOĹŠÄ+': 'WIADOMOŚĆ', 'WIADOMOĹŠÄ‡': 'WIADOMOŚĆ', 'Ä†': 'Ć',
    'Ĺš': 'Ś'
}

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f'Error reading {f}: {e}')
        continue
        
    new_content = content
    for bad, good in replacements.items():
        new_content = new_content.replace(bad, good)
        
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Fixed {f}')
