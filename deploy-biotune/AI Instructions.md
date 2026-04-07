# AI Instructions - GROUND TRUTH (EXTENDED)

> [!IMPORTANT]
> **GLOBAL RULE FOR AI AGENTS**:
> Before any action, you MUST verify your workspace path and project type.
> CONSULT the "Project Atlas" below for the specific role of each folder and script.
> ALWAYS perform `git pull origin main` before starting and `git push` after verification.

---

## 🗺 Project Atlas & Folder Map

### 1. BioTune Workspace (deploy-biotune)

**Path**: `C:\Users\Stanley\Coding-Kocur\deploy-biotune`
This is a multi-functional repository. Maintain strict separation of concerns.

#### 🌐 Web Development (BioTune Site)

* **Core Pages**:
  * `index.html`: The landing page featuring the hero section, brand story, and "Anti-Camouflage" logo logic.
  * `shop.html`: Product grid with dynamic category filtering and cart integration.
  * `product.html`: Dynamic Product Detail Page (PDP) that renders data based on URL parameters.
  * `about.html`: Company background and lab-quality narrative.
  * `checkout.html`: Order finalization and payment gateway mockup.
  * `login.html`, `register.html`, `forgot-password.html`: Full authentication UI suite.
  * `404.html` & `/404-custom`: Custom page with a particle-background effect for missing routes.
* **Assets & Styling**:
  * `/js/main.js`: The central hub for cart state, wishlist management, and the `adjustNavScale` zoom-protection script.
  * `/css/custom.css`: Contains the "Glassmorphism" system, logo-inversion filters, and mobile spacing tokens.
  * `/assets`: Production-ready media. Includes `/products` (catalog), `/hero` (backgrounds), and `/logos`.
* **Legacy Data & Scrapers**:
  * `/BioTuneStronaWWW`: Archive of raw image uploads and hosting backups.
  * `me_scraper.py`, `fetch_me.py`: Historical scripts used to pull design references from competing sites.

#### 🎓 University & Academic (Internalized)

* `/Manufacturing`: Manufacturing engineering repository.
  * `expand_report.py`: Automation script for elaborating process maps into full reports.
  * `mold.jpg`, `cnc.jpg`, `iron.jpg`, `pouring.jpg`, `cmm.jpg`: Visual process documentation for mold manufacturing analysis.
* `/Mechanical Engineering 2`: Docs for advanced mechanical theory and system design.
* `/Erasmus`: Mobility documentation and `erasmus_report.py` for data-driven student reports.
* `/Lab9_Excel`: Data exports and CSV processing exercises.

#### 🧪 Scripting & Utility (The Toolkit)

* **Image Optimization**:
  * `remove-bg-logo.mjs`, `remove-bg-smart.mjs`, `remove-bg-jimp.js`: Multi-layered background removal tools for product photos.
  * `sharpen-logo.mjs`, `upscale-image.mjs`: High-precision branding refinements for vector-like clarity on PNG assets.
* **Encoding & Git Protection**:
  * `repair-bom.js`, `add-bom.js`, `fix-encoding.js`: Essential for stripping/adding Byte Order Marks (BOM) to prevent Windows scripts from breaking CI/CD pipelines.
* **Client Automation (Plany Management)**:
  * `create_diet_plan.js`, `create_client_report.js`: Core PDF engines for workout/diet protocol generation.
  * `update_artem_report.js`, `create_maciej_plan_v2.py`: Specialized data-merging scripts for specific recurring clients.

---

### 2. Tutoring Workspace (korepetycje)

**Path**: `C:\Users\Stanley\Coding-Kocur\korepetycje`

* `/notatki_korepetycje`: Categorized teaching notes (`A2 - Pre-Intermediate`, `B1`, `B2`).
* `/Strona WWW`: Web front-end for tutoring service marketing.

---

### 3. Workout & Diet Workspace (plany-treningowe)

**Path**: `C:\Users\Stanley\Coding-Kocur\plany-treningowe`

* **Client Management**: Folders for `Artem`, `Ja`, `Julek`, `KacperCh`, `Kuba`, `Maciej`, `Nadja`, `Weronika`.
  * `Artem/Zdjecia_Progresowe`: Weekly progression photos (organized by `Week_1`, etc.).
* `/Szablony`: Standardized protocol templates for diets and training.
* **/Diet Scripts**: `create_diet_plan.js`, `create_client_report.js` (Used to generate protocol PDFs).

---

### 4. Direct Desktop Workspaces

* **`C:\Users\Stanley\Desktop\PŁ Dokumenty`**: Primary staging for academic reports (`Manofacturing engineering project.docx`).
* **`C:\Users\Stanley\Desktop\Etykiety`**: High-precision label design drafts (SVG/PDF).

---

## 🔄 Deployment & Sync Protocol

1. **Strict Pull**: Before editing, ensure local is up to date: `git pull origin main`.
2. **BioTune Specifics**: All changes must be pushed to `main`. To update the live site, force sync to `gh-pages`:

   ```bash
   git push origin main:gh-pages --force
   ```

3. **Automatic Push Rule**:
   * WORKOUT -> Sync `plany-treningowe`.
   * TUTORING -> Sync `korepetycje`.
   * E-COMMERCE -> Sync `deploy-biotune`.
   * UNIVERSITY -> Sync `PŁ Dokumenty` (Auto-init git if missing).

## ⚠️ Known Issues for Agents (RooCode/DeepSeek)

* **Path Confusion**: Agents often mistake `deploy-biotune` for a pure web repo. It contains University files—DO NOT move or delete university folders when "cleaning" the web project.
* **Logo Preservation**: Navbar uses `biotune-logo-dark-mode.png`. Use the `logo-white-overlay` CSS technique for inversion. **DO NOT replace PNG with SVG.**
* **Encoding**: Scripts in the root like `repair-bom.js` are used because Windows often adds BOMs that break Linux/GH-Actions.
