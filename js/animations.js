if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

let aboutAnimationsInitialized = false;

function initAnimations() {
    if (!window.gsap || !window.ScrollTrigger) {
        console.warn("GSAP or ScrollTrigger not loaded. Animations disabled.");
        return;
    }

    // Only initialize once
    if (aboutAnimationsInitialized) {
        return;
    }
    aboutAnimationsInitialized = true;

    const canvas = document.getElementById("sequence-canvas");
    const context = canvas ? canvas.getContext("2d") : null;

    // --- Canvas Setup ---
    const frameCount = 187;
    const currentFrame = index => `./assets/sequence/frame_${index.toString().padStart(3, '0')}.png`;
    const images = [];
    const sequence = { frame: 0 };

    if (canvas && context) {
        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        const render = () => {
            const img = images[sequence.frame];
            if (img && img.complete) {
                const dpr = window.devicePixelRatio || 1;
                context.clearRect(0, 0, canvas.width, canvas.height);
                const scale = Math.max(
                    canvas.width / dpr / img.width,
                    canvas.height / dpr / img.height
                ) * 1.7;
                const x = (canvas.width / dpr - img.width * scale) / 2;
                const y = (canvas.height / dpr - img.height * scale) / 2;
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            render();
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        if (images[0].complete) {
            render();
        } else {
            images[0].onload = render;
        }

        // DNA Sequence Animation - Smooth scrubbing with scroll (NO LAG)
        gsap.to(sequence, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: "#about",
                start: "top top",
                end: "50% top",
                scrub: 0.5, // Smooth scrubbing - lower = more responsive
                onUpdate: render
            }
        });
    }

    // === TYPEWRITER ANIMATIONS - Trigger once, text stays ===

    const typewriterTextEl = document.getElementById("typewriter-text");
    const headlineContainer = document.getElementById("about-headline-container");

    // Store completed lines
    const completedLines = [];

    const typewriterLines = [
        {
            text: "Precyzja w każdym mikrogramie.",
            trigger: "top top"
        },
        {
            text: "Nowa era badań nad peptydami.",
            trigger: "15% top"
        },
        {
            text: "Każdy miligram ma znaczenie.",
            trigger: "25% top"
        }
    ];

    typewriterLines.forEach((line, index) => {
        const proxy = { val: 0 };
        let lineCompleted = false;

        gsap.to(proxy, {
            val: line.text.length,
            duration: line.text.length * 0.05,
            ease: "none",
            scrollTrigger: {
                trigger: "#about",
                start: line.trigger,
                toggleActions: "play none none none",
                once: true,
                onEnter: () => {
                    // Start typing animation
                    const typingInterval = setInterval(() => {
                        if (proxy.val >= line.text.length) {
                            clearInterval(typingInterval);
                            completedLines.push(line.text);
                            lineCompleted = true;
                            return;
                        }
                        proxy.val += 1;
                        if (typewriterTextEl) {
                            typewriterTextEl.textContent = line.text.substring(0, Math.floor(proxy.val));
                        }
                    }, 50); // 50ms per character
                }
            }
        });
    });

    // Scroll the headline container up as user scrolls
    gsap.to("#about-headline-container", {
        y: -200,
        scrollTrigger: {
            trigger: "#about",
            start: "20% top",
            end: "40% top",
            scrub: 1 // Smooth scrolling with user's scroll
        }
    });

    // Fade out headline at certain point
    gsap.to("#about-headline-container", {
        opacity: 0,
        scrollTrigger: {
            trigger: "#about",
            start: "35% top",
            end: "45% top",
            scrub: 1,
            toggleActions: "play none none reverse" // Allow reverse
        }
    });

    // Fade in first paragraph
    gsap.fromTo("#about-p1",
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            scrollTrigger: {
                trigger: "#about",
                start: "40% top",
                end: "50% top",
                scrub: 1,
                toggleActions: "play none none reverse"
            }
        }
    );

    // Transition to microscope
    gsap.to("#sequence-canvas", {
        opacity: 0,
        scrollTrigger: {
            trigger: "#about",
            start: "60% top",
            end: "70% top",
            scrub: 1,
            toggleActions: "play none none reverse"
        }
    });

    gsap.to("#microscope-bg", {
        opacity: 1,
        scrollTrigger: {
            trigger: "#about",
            start: "60% top",
            end: "70% top",
            scrub: 1,
            toggleActions: "play none none reverse"
        }
    });

    // Fade out first paragraph
    gsap.to("#about-p1", {
        opacity: 0,
        y: -50,
        scrollTrigger: {
            trigger: "#about",
            start: "65% top",
            end: "75% top",
            scrub: 1,
            toggleActions: "play none none reverse"
        }
    });

    // Fade in second paragraph
    gsap.fromTo("#about-p2",
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            scrollTrigger: {
                trigger: "#about",
                start: "75% top",
                end: "85% top",
                scrub: 1,
                toggleActions: "play none none reverse"
            }
        }
    );

    // Input animations
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, { borderColor: '#ff0000', boxShadow: '0 0 10px rgba(255,0,0,0.3)', duration: 0.3 });
        });
        input.addEventListener('blur', () => {
            gsap.to(input, { borderColor: '#374151', boxShadow: 'none', duration: 0.3 });
        });
    });
}

window.initAnimations = initAnimations;
