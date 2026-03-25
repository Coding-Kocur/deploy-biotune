import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

head_match = re.search(r'(<head>.*?</head>)', html, re.DOTALL)
head = head_match.group(1) if head_match else ""

nav_match = re.search(r'(<nav.*?</nav>)', html, re.DOTALL)
nav = nav_match.group(1) if nav_match else ""
nav = nav.replace("hero-glass ", "")

body = f"""
<body class="bg-gray-50 text-gray-900 dark:bg-biotune-black dark:text-white font-sans antialiased selection:bg-biotune-red selection:text-white transition-colors duration-300 overflow-hidden">
    {nav}

    <section class="h-screen w-full relative flex flex-col items-center justify-center bg-transparent">
        <canvas id="particle-canvas"></canvas>
        
        <div class="content-404 relative z-10 text-center px-4 flex flex-col items-center">
            <h1 class="text-[8rem] md:text-[15rem] font-black text-biotune-red leading-none tracking-tighter drop-shadow-[0_0_25px_rgba(255,0,0,0.7)]" style="font-family: monospace;">
                404
            </h1>
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Not Found
            </h2>
            <p class="text-gray-400 max-w-md mx-auto mb-10 text-lg">
                Podana sekwencja nie istnieje. Szukany zasób wyparował ze środowiska badawczego.
            </p>
            <a href="index.html" class="inline-block bg-biotune-red/10 text-biotune-red border border-biotune-red hover:bg-biotune-red hover:text-white px-8 py-3 font-bold uppercase tracking-widest rounded transition-all duration-300 backdrop-blur-sm">
                Powrót do bazy
            </a>
        </div>
    </section>

    <!-- Cart Drawer (required for nav logic) -->
    <div id="cart-drawer" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-black border-l border-white/10 transform translate-x-full transition-transform duration-300 z-[60] shadow-2xl flex flex-col text-white">
        <div class="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 class="text-xl font-bold">Twój Koszyk</h2>
            <button id="close-cart" class="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <div id="cart-items" class="flex-1 overflow-y-auto p-6 space-y-4">
            <p class="text-center text-gray-500 mt-10">Twój koszyk jest pusty.</p>
        </div>
        <div class="p-6 border-t border-white/10 bg-black/20">
            <div class="flex justify-between items-center mb-4 text-lg font-bold"><span>Suma:</span><span id="cart-total">0.00 PLN</span></div>
            <button id="checkout-btn" class="w-full bg-biotune-red text-white font-bold py-3 px-6 hover:bg-red-600 transition-colors uppercase tracking-wider">Przejdź do kasy</button>
        </div>
    </div>
    <div id="overlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] hidden opacity-0 transition-opacity duration-300"></div>

    <script src="./js/products-data.js"></script>
    <script src="./js/shop.js"></script>
    <script src="./js/main.js"></script>
    <script>
        const navElem = document.querySelector('nav.glass');
        window.addEventListener('scroll', () => {{
            if (window.scrollY > 50) {{
                navElem.classList.add('scrolled');
            }} else {{
                navElem.classList.remove('scrolled');
            }}
        }});
    </script>
    
    <style>
        #particle-canvas {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }}
    </style>
    
    <script>
        // RED GLITTER ANIMATION
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        const mouse = {{ x: window.innerWidth / 2, y: window.innerHeight / 2 }};
        let animationId;

        // ONLY RED SHADES (Brand consistency)
        const colors = [
            '#ff0000',
            '#cc0000',
            '#ff3333',
            '#ff4d4d',
            '#990000',
            '#ff1a1a'
        ];

        function resize() {{
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }}

        function createParticle() {{
            const color = colors[Math.floor(Math.random() * colors.length)];
            return {{
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                baseX: Math.random() * canvas.width,
                baseY: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.8,
                length: Math.random() * 6 + 2,
                color: color,
                alpha: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                vx: 0,
                vy: 0,
                driftX: (Math.random() - 0.5) * 0.3,
                driftY: (Math.random() - 0.5) * 0.3,
            }};
        }}

        function init() {{
            resize();
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 5000), 300);
            for (let i = 0; i < count; i++) {{
                particles.push(createParticle());
            }}
        }}

        function animate() {{
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {{
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 200;

                if (dist < maxDist) {{
                    const force = (1 - dist / maxDist) * 0.8;
                    const attractAngle = Math.atan2(dy, dx);
                    p.vx += (Math.cos(attractAngle + Math.PI / 2) * force * 0.5 + Math.cos(attractAngle) * force * 0.15);
                    p.vy += (Math.sin(attractAngle + Math.PI / 2) * force * 0.5 + Math.sin(attractAngle) * force * 0.15);
                }}

                p.vx += p.driftX * 0.01;
                p.vy += p.driftY * 0.01;
                p.vx += (p.baseX - p.x) * 0.0003;
                p.vy += (p.baseY - p.y) * 0.0003;
                p.vx *= 0.97;
                p.vy *= 0.97;
                p.x += p.vx;
                p.y += p.vy;
                p.angle += p.rotationSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.length / 2, -p.size / 2, p.length, p.size);
                ctx.restore();
            }});

            animationId = requestAnimationFrame(animate);
        }}

        window.addEventListener('mousemove', (e) => {{
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }});

        window.addEventListener('resize', () => {{
            resize();
            particles.forEach(p => {{
                p.baseX = Math.random() * canvas.width;
                p.baseY = Math.random() * canvas.height;
            }});
        }});

        init();
        animate();
    </script>
</body>
"""

final_html = f"<!DOCTYPE html>\n<html lang=\"pl\" class=\"dark\" style=\"scroll-behavior: smooth;\">\n{head}\n{body}\n</html>"

with open('404.html', 'w', encoding='utf-8') as f:
    f.write(final_html)
