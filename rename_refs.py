import glob
import os

directory = os.path.dirname(os.path.abspath(__file__))

replacements = [
    # Class/ID renames
    ('zetta-sweep', 'btn-sweep'),
    ('zj-text', 'intro-text'),
    # Comment removal
    ('/* Zetta-Joule sweep-fill button animation */', '/* Button sweep-fill animation */'),
    ('/* Zetta-Joule sweep button animation */', '/* Button sweep-fill animation */'),
    ('// Zetta-Joule', ''),
    ('/* zetta', '/*'),
    ('// zetta', '//'),
    # Any remaining "Zetta" in comments
    ('Zetta-Joule', ''),
    ('ZettaJoule', ''),
    ('zetta joule', ''),
    # Chrome homepage references
    ('chrome-homepage', ''),
    ('chrome homepage', ''),
    ('// antigravity', '//'),
]

extensions = ('*.html', '*.css', '*.js')
changed_files = []

for ext in extensions:
    for filepath in glob.glob(os.path.join(directory, '**', ext), recursive=True):
        if 'rename_refs.py' in filepath:
            continue
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            for old, new in replacements:
                content = content.replace(old, new)
            
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                changed_files.append(os.path.relpath(filepath, directory))
        except Exception as e:
            print(f'Error: {filepath}: {e}')

for f in changed_files:
    print(f'Fixed: {f}')
print(f'\nTotal files changed: {len(changed_files)}')
