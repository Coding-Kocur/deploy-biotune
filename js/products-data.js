const products = [
    {
        id: 'retatrutide',
        name: 'Retatrutide',
        dosage: '10mg',
        price: 299.00,
        stock: 30,
        description: 'Retatrutide (LY-3437943) to eksperymentalny peptyd, potrójny agonista receptorów GLP-1, GIP i glukagonu. W badaniach przedklinicznych wykazuje silną aktywność metaboliczną, wpływając na regulację glukozy, lipolizę oraz homeostazę energetyczną. Badany intensywnie pod kątem mechanizmów regulacji apetytu i wydatku energetycznego w modelach zwierzęcych.',
        cas: '2381089-83-2',
        molarMass: '~5400 Da',
        formula: 'C₂₃₈H₃₇₂N₇₂O₇₅S',
        images: ['./assets/products/retatrutide-1.png', './assets/products/retatrutide-2.jpg', './assets/products/retatrutide-3.jpg']
    },
    {
        id: 'bpc-157-tb-500',
        name: 'BPC-157 + TB-500',
        dosage: '5mg+5mg',
        price: 219.00,
        stock: 30,
        description: 'Synergiczna mieszanka dwóch peptydów regeneracyjnych. BPC-157 (Body Protection Compound) to pentadekapeptyd izolowany pierwotnie z soku żołądkowego, wykazujący w badaniach działanie cytoprotekcyjne i proangiogenne. TB-500 (Thymosin Beta-4) to peptyd 43-aminokwasowy zaangażowany w procesy migracji komórek, różnicowania i gojenia ran. Intensywnie badane w modelach zwierzęcych pod kątem regeneracji tkanek miękkich, ścięgien i mięśni.',
        cas: '137525-51-0 / 77591-33-4',
        molarMass: '1419.53 / 4963.5 g/mol',
        formula: 'C₆₂H₉₈N₁₆O₂₂ / C₂₁₂H₃₅₀N₅₆O₇₈S',
        images: ['./assets/products/bpc-157-tb-500.png']
    },
    {
        id: 'cjc-1295-ipamorelin',
        name: 'CJC-1295 + Ipamorelin',
        dosage: '5mg+5mg',
        price: 219.00,
        stock: 30,
        description: 'Synergiczne połączenie dwóch peptydów wpływających na oś somatotropową. CJC-1295 (bez DAC) to analog GHRH (hormonu uwalniającego hormon wzrostu), który stymuluje przysadkę mózgową do wydzielania GH. Ipamorelin to selektywny agonista receptora ghreliny (GHSR) o minimalnym wpływie na kortyzol i prolaktynę. W badaniach na modelach zwierzęcych wykazano synergistyczne zwiększenie pulsacyjnego wydzielania GH.',
        cas: '863288-34-0 / 170851-70-4',
        molarMass: '3367.9 / 711.85 g/mol',
        formula: 'C₁₅₂H₂₅₂N₄₄O₄₂ / C₃₈H₄₉N₉O₅',
        images: ['./assets/products/cjc-1295-ipamorelin.jpg']
    },
    {
        id: 'hgh-fragment-176-191',
        name: 'HGH Fragment 176-191',
        dosage: '2mg',
        price: 79.00,
        stock: 30,
        description: 'Fragment 176-191 ludzkiego hormonu wzrostu (hGH) to zmodyfikowany 16-aminokwasowy peptyd odpowiadający C-końcowej części cząsteczki GH. W badaniach przedklinicznych wykazuje aktywność lipolityczną bez wpływu na poziom glukozy i proliferację komórek. Mechanizm działania obejmuje stymulację lipolizy i hamowanie lipogenezy poprzez interakcję z receptorami tkanki tłuszczowej. Badany w modelach otyłości u gryzoni.',
        cas: '221231-10-3',
        molarMass: '1817.12 g/mol',
        formula: 'C₇₈H₁₂₅N₂₃O₂₃S₂',
        images: ['./assets/products/hgh-fragment-176-191.jpg']
    },
    {
        id: 'ghk-cu',
        name: 'GHK-Cu',
        dosage: '50mg',
        price: 179.00,
        stock: 30,
        description: 'GHK-Cu (Glicylo-L-histydylo-L-lizyna:miedź) to tripeptyd naturalnie występujący w osoczu, ślinie i moczu. Posiada wysokie powinowactwo do jonów miedzi(II). W badaniach in vitro i na modelach zwierzęcych wykazuje właściwości stymulujące syntezę kolagenu, elastyny i glikozaminoglikanów. Badany pod kątem procesów gojenia ran, regeneracji skóry oraz wpływu na angiogenezę i aktywność przeciwzapalną.',
        cas: '49557-75-7',
        molarMass: '403.93 g/mol',
        formula: 'C₁₄H₂₄CuN₆O₄',
        images: ['./assets/products/ghk-cu.jpg']
    },
    {
        id: 'melanotan-2',
        name: 'Melanotan 2',
        dosage: '10mg',
        price: 99.00,
        stock: 30,
        description: 'Melanotan II to syntetyczny cykliczny heptapeptyd, analog naturalnego hormonu α-melanotropiny (α-MSH). Działa jako nieselektywny agonista receptorów melanokortynowych (MC1R-MC5R). W badaniach przedklinicznych wykazuje zdolność do stymulacji melanogenezy (syntezy melaniny w melanocytach) oraz wpływ na zachowania seksualne i apetyt. Badany w modelach zwierzęcych pod kątem fotoprotekcji i pigmentacji.',
        cas: '121062-08-6',
        molarMass: '1024.18 g/mol',
        formula: 'C₅₀H₆₉N₁₅O₉',
        images: ['./assets/products/melanotan-2.jpg']
    },
    {
        id: 'pt-141',
        name: 'PT-141',
        dosage: '10mg',
        price: 119.00,
        stock: 30,
        description: 'PT-141 (Bremelanotide) to cykliczny heptapeptyd, metabolit aktywny Melanotanu II. Działa jako selektywny agonista receptorów melanokortynowych MC3R i MC4R w ośrodkowym układzie nerwowym. W badaniach przedklinicznych wykazuje wpływ na szlaki neuralne związane z pobudzeniem seksualnym, działając centralnie bez wpływu na układ naczyniowy. Badany w modelach zwierzęcych pod kątem mechanizmów regulacji funkcji seksualnych.',
        cas: '189691-06-3',
        molarMass: '1025.18 g/mol',
        formula: 'C₅₀H₆₈N₁₄O₁₀',
        images: ['./assets/products/pt-141.jpg']
    },
    {
        id: 'epithalon',
        name: 'Epithalon',
        dosage: '10mg',
        price: 139.00,
        stock: 30,
        description: 'Epithalon (Epitalon) to syntetyczny tetrapeptyd (Ala-Glu-Asp-Gly) będący analogiem Epithalaminu - peptydu produkowanego przez szyszynkę. W badaniach in vitro wykazano jego zdolność do aktywacji telomerazy - enzymu odpowiedzialnego za wydłużanie telomerów. Badania na modelach zwierzęcych sugerują potencjalny wpływ na regulację cyklu dobowego i funkcje neuroendokrynne. Intensywnie badany w kontekście biologii starzenia.',
        cas: '307297-39-8',
        molarMass: '390.35 g/mol',
        formula: 'C₁₄H₂₂N₄O₉',
        images: ['./assets/products/epithalon.jpg']
    },
    {
        id: 'mots-c',
        name: 'MOTS-c',
        dosage: '5mg',
        price: 119.00,
        stock: 30,
        description: 'MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA-c) to 16-aminokwasowy peptyd kodowany przez mitochondrialny DNA. Odkryty w 2015 roku jako nowy regulator metabolizmu. W badaniach przedklinicznych wykazuje zdolność do aktywacji szlaku AMPK, poprawy wrażliwości insulinowej i regulacji homeostazy glukozy. Badany na modelach zwierzęcych pod kątem biologii mitochondrialnej, metabolizmu energetycznego i procesów starzenia.',
        cas: '1627580-64-6',
        molarMass: '2174.67 g/mol',
        formula: 'C₁₀₁H₁₅₂N₂₈O₂₃S₂',
        images: ['./assets/products/mots-c.jpg']
    },
    {
        id: 'semax',
        name: 'Semax',
        dosage: '5mg',
        price: 69.00,
        stock: 30,
        description: 'Semax to syntetyczny heptapeptyd będący analogiem fragmentu 4-10 hormonu adrenokortykotropowego (ACTH). Został opracowany w Rosji jako neuropeptyd o właściwościach nootropowych. W badaniach przedklinicznych wykazuje działanie neuroprotekcyjne, stymuluje ekspresję BDNF (czynnika neurotroficznego pochodzenia mózgowego) i wpływa na plastyczność synaptyczną. Badany w modelach zwierzęcych pod kątem funkcji kognitywnych i ochrony neuronów.',
        cas: '80714-61-0',
        molarMass: '813.93 g/mol',
        formula: 'C₃₇H₅₁N₉O₁₀',
        images: ['./assets/products/semax.jpg']
    },
    {
        id: 'selank',
        name: 'Selank',
        dosage: '5mg',
        price: 99.00,
        stock: 30,
        description: 'Selank to syntetyczny heptapeptyd będący analogiem tuftsynu - naturalnego peptydu immunomodulującego. Opracowany w Instytucie Genetyki Molekularnej Rosyjskiej Akademii Nauk. W badaniach przedklinicznych wykazuje właściwości anksolityczne (przeciwlękowe) bez działania sedatywnego. Wpływa na system GABAergiczny oraz moduluje ekspresję genów związanych z neurotroficznością. Badany w modelach zwierzęcych pod kątem regulacji lęku i funkcji immunologicznych.',
        cas: '129954-34-3',
        molarMass: '751.88 g/mol',
        formula: 'C₃₃H₅₇N₁₁O₉',
        images: ['./assets/products/selank.jpg']
    }
];

// Product purpose (displayed on product pages)
const PRODUCT_PURPOSE = 'Oferowane substancje są odczynnikami chemicznymi analitycznymi, przeznaczonymi wyłącznie do zastosowań badawczych in vitro. Produkt nie jest produktem leczniczym, środkiem spożywczym, suplementem diety ani kosmetykiem. Produkt nie nadaje się do użycia u ludzi i zwierzęt.';

window.productsData = products;
window.PRODUCT_PURPOSE = PRODUCT_PURPOSE;
