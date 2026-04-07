import os
import glob
import re

search_pattern = re.compile(r'<span class="text-3xl font-bold text-white tracking-tighter">\s*Bio\s*<span[^>]*>Tune</span>\s*</span>', re.IGNORECASE)
replace_str = '<img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;">'

files = glob.glob('*.html')
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # also apply to previously updated files in case they were updated with a worse replace string, but wait, those no longer have the span!
        # wait, the first few files used a DIFFERENT replace_str without the margin!
        # I should replace BOTH the original span AND the old img tag from the first run.
        
        old_replace_str = '<img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="h-60 w-auto pointer-events-none">'
        if old_replace_str in content:
            content = content.replace(old_replace_str, replace_str)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Re-Updated {f} with margins')
            continue

        if search_pattern.search(content):
            content = search_pattern.sub(replace_str, content)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Updated {f}')
    except Exception as e:
        pass
