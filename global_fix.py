import os
import glob
import re

password_script = """
    <script>
        // Access Code Protection
        (function() {
            if (sessionStorage.getItem('biotune_access_granted') === 'true') return;
            
            // Hide everything immediately to prevent flashing content
            document.documentElement.style.opacity = '0';
            document.documentElement.style.pointerEvents = 'none';
            document.documentElement.style.transition = 'opacity 0.2s';
            
            window.addEventListener('load', function() {
                setTimeout(function() {
                    let pw = prompt("Dostęp chroniony. Proszę podać kod dostępu:");
                    if (pw === "Nadja7072") {
                        sessionStorage.setItem('biotune_access_granted', 'true');
                        document.documentElement.style.opacity = '1';
                        document.documentElement.style.pointerEvents = 'auto';
                    } else {
                        document.body.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#030303;color:#ff0000;font-family:monospace;font-size:1.5rem;text-align:center;'>Brak dostępu / Ochrona kodem</div>";
                        document.documentElement.style.opacity = '1';
                        document.documentElement.style.pointerEvents = 'auto';
                    }
                }, 100);
            });
        })();
    </script>
"""

new_logo_block = '''<a href="index.html" class="inline-flex relative h-12 w-48 mb-6 items-center cursor-pointer">
                        <img src="./assets/biotune-logo-dark-mode.png" alt="BioTune" class="absolute top-1/2 -translate-y-1/2 -left-3 h-60 w-auto pointer-events-none max-w-none">
                    </a>'''

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return # Skip non-utf8 files

    changed = False
    
    # 1. Add password protection if missing
    if 'biotune_access_granted' not in content:
        content = content.replace('<head>', '<head>\n' + password_script)
        changed = True

    # 2. Fix footer logo if present
    # Target various versions of the old logo span/img
    footer_patterns = [
        r'<a href="index\.html" class="inline-block mb-6">\s*<span class="text-3xl font-bold text-white tracking-tighter">Bio<span class="text-biotune-red">Tune</span></span>\s*</a>',
        r'<a href="index\.html" class="inline-block mb-6">\s*<img src="\./assets/biotune-logo-dark-mode\.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;">\s*</a>',
        r'<a href="index\.html" class="inline-block mb-6"><img src="\./assets/biotune-logo-dark-mode\.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;"></a>',
        r'<img src="\./assets/biotune-logo-dark-mode\.png" alt="BioTune" class="h-60 w-auto pointer-events-none" style="margin-top: -6rem; margin-bottom: -6rem; margin-left: -5rem;">'
    ]
    
    for pattern in footer_patterns:
        reg = re.compile(pattern, re.IGNORECASE)
        if reg.search(content):
            content = reg.sub(new_logo_block, content)
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    # Only search in specific relevant folders and root to avoid node_modules etc.
    relevant_dirs = ['.', 'deploy-biotune']
    for d in relevant_dirs:
        for f in glob.glob(os.path.join(d, "*.html")):
            process_file(f)

if __name__ == "__main__":
    main()
