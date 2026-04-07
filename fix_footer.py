import os
import glob
import re

def fix_footer():
    files = glob.glob('*.html')
    for f in files:
        changed = False
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Replace the img tag and its aggressive styling
            pattern = re.compile(r'<a href="index\.html" class="inline-block mb-6">\s*<img src="\./assets/biotune-logo-dark-mode\.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;">\s*</a>')
            
            new_block = '''<a href="index.html" class="inline-flex relative h-12 w-48 mb-6 items-center cursor-pointer">
                            <img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="absolute top-1/2 -translate-y-1/2 -left-3 h-60 w-auto pointer-events-none max-w-none">
                        </a>'''
            
            if pattern.search(content):
                content = pattern.sub(new_block, content)
                changed = True
                
            # Also catch cases where spacing might slightly differ
            pattern2 = re.compile(r'<a href="index\.html" class="inline-block mb-6"><img src="\./assets/biotune-logo-dark-mode\.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;"></a>')
            if pattern2.search(content):
                content = pattern2.sub(new_block, content)
                changed = True

            # And if the user has an un-indented version
            pattern3 = re.compile(r'<img src="\./assets/biotune-logo-dark-mode\.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;">')
            if pattern3.search(content) and not changed:
                # wait, if the a tag is around it, we might end up with double inline-block.
                content = content.replace(
                    '<a href="index.html" class="inline-block mb-6">\n                        <img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;">',
                    new_block
                )
                content = content.replace(
                    '<a href="index.html" class="inline-block mb-6"><img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;"></a>',
                    new_block
                )
                
                # generic replace just in case the a-tag was broken
                content = content.replace(
                    '<img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;">',
                    '<div class="relative h-12 w-48 inline-flex items-center"><img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="absolute top-1/2 -translate-y-1/2 -left-3 h-60 w-auto pointer-events-none max-w-none"></div>'
                )
                changed = True

            # Double check for files that MIGHT HAVE BEEN updated in the previous run that crashed halfway 
            # I updated some html files to the previous version, wait! Let me also search for my PREVIOUS replacement and replace IT with the slightly better -left-3 instead of -left-6!
            old_new_block = '''<a href="index.html" class="inline-flex relative h-12 w-48 mb-6 items-center">
                        <img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="absolute top-1/2 -translate-y-1/2 -left-6 h-60 w-auto pointer-events-none max-w-none">
                    </a>'''
            if old_new_block in content:
                content = content.replace(old_new_block, new_block)
                changed = True

            if changed:
                with open(f, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f'Fixed {f}')
        except Exception as e:
            pass

fix_footer()
