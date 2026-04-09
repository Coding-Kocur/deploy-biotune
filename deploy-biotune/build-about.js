const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'about.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Hero (O NAS) and Section 1 (Nasza Wizja)
const heroStart = content.indexOf('<!-- Hero Section -->');
const missionStart = content.indexOf('<!-- SECTION 2: Nasza Misja');

if (heroStart !== -1 && missionStart !== -1) {
    content = content.slice(0, heroStart) + content.slice(missionStart);
}

// 2. Wrap Sections 2, 3, 4 into a horizontal scroll wrapper
// The sections to wrap end before <!-- Contact Section -->
const contactStart = content.indexOf('<!-- Contact Section -->');
const newMissionStart = content.indexOf('<!-- SECTION 2: Nasza Misja');

if (newMissionStart !== -1 && contactStart !== -1) {
    let sectionsPart = content.slice(newMissionStart, contactStart);

    // Add classes w-screen flex-shrink-0 to the sections
    sectionsPart = sectionsPart.replace(/<section class="/g, '<section class="w-screen flex-shrink-0 overflow-y-auto overflow-x-hidden ');

    const wrapperHTML = `
    <div id="horizontal-scroll-wrapper" style="height: 300vh; position: relative;">
        <div id="horizontal-scroll-sticky" style="position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex;">
            <div id="horizontal-scroll-content" class="flex" style="width: 300vw; will-change: transform;">
                ${sectionsPart}
            </div>
        </div>
    </div>
    `;

    content = content.slice(0, newMissionStart) + wrapperHTML + content.slice(contactStart);
}

// 3. Inject JS for horizontal scroll mapping
const jsScript = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const wrapper = document.getElementById('horizontal-scroll-wrapper');
            const sticky = document.getElementById('horizontal-scroll-sticky');
            const content = document.getElementById('horizontal-scroll-content');
            
            if(wrapper && sticky && content) {
                window.addEventListener('scroll', () => {
                    const rect = wrapper.getBoundingClientRect();
                    const maxScroll = rect.height - window.innerHeight;
                    
                    // How far we've scrolled into the wrapper
                    let scrollProgress = -rect.top / maxScroll;
                    scrollProgress = Math.max(0, Math.min(1, scrollProgress));
                    
                    const maxTranslate = content.scrollWidth - window.innerWidth;
                    content.style.transform = \`translateX(-\${scrollProgress * maxTranslate}px)\`;
                });
            }
        });
    </script>
</body>
`;

content = content.replace('</body>', jsScript);

fs.writeFileSync(filePath, content);
console.log('about.html restructure applied');
