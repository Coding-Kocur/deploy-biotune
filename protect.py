import glob
import os

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

files = glob.glob('*.html')
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if 'biotune_access_granted' not in content:
            # Insert right after <head>
            content = content.replace('<head>', '<head>\n' + password_script)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Protected {f}')
    except Exception as e:
        print(f"Skipping {f}: {e}")
