const ExcelJS = require('exceljs');
const filePath = 'C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Ja\\Dieta.xlsx';

// Słownik RDI
const rdi = {
    protein: 50, carbs: 300, fat: 78, fiber: 28, kcal: 2000,
    sfa: 20, mufa: 0, o3: 1.6, o6: 14,
    k: 3500, na: 2300, ca: 1000, fe: 8, mg: 400, zn: 11, se: 55, p: 700,
    vitA: 900, vitD: 20, vitE: 15, vitK: 120, vitC: 90,
    b1: 1.2, b2: 1.3, b3: 16, b6: 1.7, b12: 2.4, folate: 400, choline: 550
};

// Nutrients [0..30]
const n = {
    'Białko jaj': [10.9, 0.7, 0.17, 0, 48, 163, 166, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .01, .44, .1, 0, .09, 4, 7, .08, 11, .03, 20, 15, 1.1],
    'Jajko całe': [12.6, 0.72, 9.51, 0, 143, 138, 142, 3.1, 3.7, 0.07, 1.1, 0, 0, 160, 2, 1.1, .3, 0, .04, .46, .08, .17, 1.1, 47, 56, 1.8, 12, 1.3, 31, 198, 251],
    'Płatki owsiane': [13.2, 67.7, 6.5, 10.1, 379, 362, 6, 1.1, 2.0, 0.1, 2.4, 4.0, 6.1, 0, 0, .4, 0, 0, .4, .16, 1.0, .14, 0, 32, 46, 4.3, 126, 2.7, 25, 387, 40],
    'Mąka kokosowa': [20, 60, 12, 40, 400, 580, 20, 10.5, 0.8, 0, 0.2, 2, 38, 0, 0, .2, 0, 0, .05, .05, .5, .1, 0, 20, 26, 3.6, 90, 2.0, 8, 206, 0],
    'Kleik ryżowy': [7, 80, 1, .5, 358, 76, 4, .3, .3, 0, .3, .2, .3, 0, 0, 0, 0, 0, .06, .03, 1.5, .1, 0, 3, 6, .4, 18, .8, 8, 85, 5],
    'Ryż basmati': [7.1, 79, 0.6, 1.3, 352, 76, 4, .2, .2, 0, .2, .3, 1, 0, 0, .1, 0, 0, .07, .05, 1.6, .16, 0, 22, 9, .8, 25, 1.1, 15, 115, 5],
    'Kasza gryczana': [13.3, 71.5, 3.4, 10, 343, 460, 1, .7, 1, .1, 1.1, 3, 7, 0, 0, .3, 0, 0, .1, .4, 7, .2, 0, 13, 18, 2.2, 231, 2.4, 8, 347, 54],
    'Ziemniaki': [2, 17.5, 0.1, 2.2, 77, 421, 6, 0, 0, 0, 0, .7, 1.5, 0, 0, 0, 2, 20, .08, .03, 1.1, .3, 0, 17, 12, .8, 23, .3, .4, 57, 12],
    'Jogurt Maluta 0%': [16.2, 4.0, 0, 0, 73, 255, 46, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, .04, .2, .1, .04, .5, 10, 120, .1, 12, .6, 3, 100, 15],
    'Kefir 0%': [3.5, 4, 0.1, 0, 31, 150, 40, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, .03, .14, .1, .04, .3, 11, 120, .1, 12, .4, 3, 100, 15],
    'WPI': [90, 2, 1, 0, 373, 150, 50, .5, .3, 0, 0, 0, 0, 0, 0, 0, 0, 0, .1, .3, .2, .04, .4, 10, 120, 0, 20, .6, 10, 60, 0],
    'Maliny': [1.2, 11.9, 0.7, 6.5, 52, 151, 1, 0, .1, .1, .2, 1, 5.5, 2, 0, .9, 8, 26, .03, .04, .6, .06, 0, 21, 25, .7, 22, .4, .2, 29, 12],
    'Ananas': [0.5, 13.1, 0.1, 1.4, 50, 109, 1, 0, 0, 0, 0, .5, .9, 3, 0, 0, .7, 48, .08, .03, .5, .11, 0, 18, 13, .3, 12, .1, .1, 8, 5],
    'Marchewka': [0.9, 9.6, 0.2, 2.8, 41, 320, 69, 0, 0, 0, .1, 1, 1.8, 835, 0, .7, 13, 6, .07, .06, 1, .14, 0, 19, 33, .3, 12, .2, .1, 35, 8],
    'Cukinia': [1.2, 3.1, 0.3, 1, 17, 261, 8, .1, 0, 0, .1, .4, .6, 10, 0, .1, 4, 18, .05, .09, .5, .16, 0, 24, 16, .4, 18, .3, .2, 38, 9],
    'Dynia': [1, 6.5, 0.1, .5, 26, 340, 1, 0, 0, 0, 0, .2, .3, 426, 0, 1, 1, 9, .05, .1, .6, .06, 0, 16, 21, .8, 12, .3, .3, 44, 8],
    'Seler korzeń': [1.5, 9.2, 0.3, 1.8, 42, 300, 100, .1, .1, 0, .1, .5, 1.3, 0, 0, .4, 41, 8, .05, .06, .7, .17, 0, 102, 43, .7, 20, .3, .7, 115, 9],
    'Papryka': [0.9, 6, 0.3, 2.1, 31, 211, 4, 0, 0, 0, 0, .7, 1.4, 157, 0, 1.6, 5, 128, .05, .09, 1, .29, 0, 43, 7, .4, 12, .3, .1, 26, 5],
    'Ogórek': [0.7, 3.6, 0.1, .5, 15, 147, 2, 0, 0, 0, 0, .2, .3, 5, 0, 0, 16, 3, .03, .03, .1, .04, 0, 7, 16, .3, 13, .2, .3, 24, 6],
    'Pomidory suszone': [14, 51, 3, 12, 258, 3427, 2095, .4, .4, .1, 1.1, 4, 8, 44, 0, 0, 43, 39, .5, .5, 9.1, .3, 0, 56, 110, 9.1, 194, 1.1, 6, 356, 105],
    'Kurczak': [23.1, 0, 1.2, 0, 110, 256, 45, .3, .4, .04, .6, 0, 0, 6, .5, .3, 0, 0, .07, .1, 11, 1, .3, 4, 6, .4, 31, .8, 39, 249, 70],
    'Łosoś pacyficzny': [21.7, 0, 4.4, 0, 127, 366, 44, 1, 1.5, 1.2, .3, 0, 0, 58, 11, .6, .4, 0, .2, .15, 5.8, .19, 5, 4, 9, .5, 24, .5, 34, 215, 95],
    'EVOO': [0, 0, 100, 0, 884, 1, 2, 14, 73, 0.8, 9.8, 0, 0, 0, 0, 14, 60, 0, 0, 0, 0, 0, 0, 0, 1, .6, 0, 0, 0, 0, 0.3],
    'Masło orz. proszek': [42, 42, 13, 6, 380, 650, 450, 2, 6, 0, 4, 2, 4, 0, 0, 3, 0, 0, .1, .1, 13, .4, 0, 58, 70, 2, 170, 3, 7, 390, 60],
    'Masło migdałowe': [21, 19, 53, 10, 614, 750, 2, 4, 32, 0, 12, 3, 7, 0, 0, 24, 0, 0, 0.2, 0.9, 3.5, 0.1, 0, 50, 270, 3.7, 270, 3.1, 3, 480, 52],
    'Nasiona chia': [17, 42, 31, 34, 486, 407, 16, 3.3, 2.3, 18, 5.8, 5, 29, 0, 0, .5, 0, 2, .6, .17, 8.8, 0, 0, 49, 631, 7.7, 335, 4.6, 55, 860, 60],
    'Pyłek kwiatowy': [23, 31, 4, 3, 262, 450, 35, 1, 1, .5, 1.5, 1, 2, 50, 1, 4, 0, 7, .5, 1.5, 5, .6, 0, 30, 50, 5, 30, 3, 3, 300, 0],
    'Cynamon cejloński': [4, 80.6, 1.2, 53.1, 247, 431, 10, .3, .2, 0, .1, 3, 50, 15, 0, 2.3, 31, 4, .02, .04, 1.3, .16, 0, 6, 1002, 8.3, 60, 1.8, 3, 64, 11],
    'Kakao 11%': [20, 16, 11, 35, 280, 1500, 21, 6.5, 3.5, 0, .4, 5, 30, 0, 0, .1, 2, 0, .1, .2, 2.2, .1, 0, 8, 128, 13.9, 499, 6.8, 14, 734, 0],
    'Czarnuszka': [10.5, 44.2, 22.3, 8, 345, 569, 88, 1.5, 15, 0.2, 3.3, 2, 6, 0, 0, 0, 0, 0, .6, .1, 4.6, .5, 0, 40, 228, 5, 230, 4, 0, 450, 0],
    'Sól': [0, 0, 0, 0, 0, 0, 39300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Omega3 kaps': [0, 0, 100, 0, 900, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'EAA': [100, 0, 0, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Dekstroza': [0, 100, 0, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Glicynian Mg': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, 0, 0],
    'L-leucyna': [100, 0, 0, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'L-cytrulina': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Alluloza': [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Zielona herbata': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'B-Complex (1tab)': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 25, 500, 400, 0, 0, 0, 0, 0, 0, 50],
    'Cynk 30mg (1tab)': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0],
    'Wit C 1000mg': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'Maślan sodu 500mg': [0, 0, 0, 0, 0, 0, 104, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // Wakame (dried) per 100g: B:3, W:9, T:0.6, Fib:0.5, Kcal:45, K:50, Na:872, Mg:107, Ca:150, Fe:2.2, Zn:0.4, P:80, VitA:18, VitK:5.3, VitC:3, B2:0.23, Folate:196, VitE:1
    'Wakame (suszone)': [3, 9, 0.6, 0.5, 45, 50, 872, 0, 0, 0.1, 0, 0, 0.5, 18, 0, 1, 5.3, 3, .06, .23, 1.6, 0, 0, 196, 150, 2.2, 107, 0.4, 0.7, 80, 0]
};

// ... (meals definitions remain the same as previous step) ...
// -------------------------------------------------------------
// DNI TRENINGOWE
// -------------------------------------------------------------
const trainingMeals = [
    {
        name: 'POSIŁEK 1 - Omlet + Kawa + Suple Rano', time: '~7:00', i: [
            ['Białko jaj', 250], ['Jajko całe', 60], ['Płatki owsiane', 40], ['Mąka kokosowa', 20],
            ['Jogurt Maluta 0%', 150], ['Czarnuszka', 10], ['Maliny', 150], ['Kakao 11%', 20],
            ['Pyłek kwiatowy', 10], ['Cynamon cejloński', 10], ['Alluloza', 10], ['Omega3 kaps', 2],
            ['B-Complex (1tab)', 100], ['Cynk 30mg (1tab)', 100], ['Wit C 1000mg', 100], ['Maślan sodu 500mg', 100]
        ]
    },
    {
        name: 'POSIŁEK 2 - Obiad (kurczak)', time: '~12:00', i: [
            ['Kurczak', 200], ['Kasza gryczana', 50],
            ['Wakame (suszone)', 5], ['EVOO', 3], ['Ananas', 30], ['Marchewka', 100], ['Cukinia', 100],
            ['Sól', 2], ['Zielona herbata', 0], ['Omega3 kaps', 2]
        ]
    },
    {
        name: 'POSIŁEK 3 - Obiad (łosoś)', time: '~15:00', note: 'BEZ omega-3 (łosoś bogaty w EPA/DHA)', i: [
            ['Łosoś pacyficzny', 200], ['Ziemniaki', 200],
            ['Pomidory suszone', 40], ['Ananas', 30], ['Dynia', 100], ['Seler korzeń', 100], ['Sól', 2], ['Zielona herbata', 0]
        ]
    },
    {
        name: 'POSIŁEK 4 - Pre-Workout', time: '~1h przed', i: [
            ['Kleik ryżowy', 40], ['Kefir 0%', 400], ['Masło orz. proszek', 20], ['WPI', 35],
            ['Kakao 11%', 20], ['Maliny', 150], ['Nasiona chia', 10], ['Cynamon cejloński', 10], ['Alluloza', 10], ['Omega3 kaps', 2]
        ]
    },
    {
        name: 'POSIŁEK 5 - Kolacja + Suple Wieczór', time: '~21:00', i: [
            ['Kurczak', 200], ['Ryż basmati', 50],
            ['EVOO', 5], ['Ananas', 30], ['Papryka', 100], ['Ogórek', 100],
            ['Sól', 2], ['Zielona herbata', 0], ['Omega3 kaps', 2],
            ['Wit C 1000mg', 100], ['Maślan sodu 500mg', 100]
        ]
    },
];

const intra = {
    name: 'INTRA WORKOUT', time: 'Podczas treningu', i: [
        ['EAA', 20], ['Dekstroza', 20], ['L-cytrulina', 10], ['Glicynian Mg', 5], ['L-leucyna', 5], ['Sól', 2]
    ]
};

// -------------------------------------------------------------
// DNI NIETRENINGOWE
// -------------------------------------------------------------
const nonTrainingMeals = [
    {
        name: 'POSIŁEK 1 - Omlet + Kawa + Suple Rano', time: '~7:00', i: [
            ['Białko jaj', 250], ['Jajko całe', 60], ['Płatki owsiane', 40], ['Mąka kokosowa', 20],
            ['Jogurt Maluta 0%', 150], ['Czarnuszka', 10], ['Maliny', 150], ['Kakao 11%', 20],
            ['Pyłek kwiatowy', 10], ['Cynamon cejloński', 10], ['Alluloza', 10], ['Omega3 kaps', 2],
            ['B-Complex (1tab)', 100], ['Cynk 30mg (1tab)', 100], ['Wit C 1000mg', 100], ['Maślan sodu 500mg', 100]
        ]
    },
    {
        name: 'POSIŁEK 2 - Obiad (kurczak)', time: '~12:00', i: [
            ['Kurczak', 200], ['Kasza gryczana', 50],
            ['Wakame (suszone)', 5], ['EVOO', 3], ['Ananas', 30], ['Marchewka', 100], ['Cukinia', 100],
            ['Sól', 2], ['Zielona herbata', 0], ['Omega3 kaps', 2]
        ]
    },
    {
        name: 'POSIŁEK 3 - Obiad (łosoś)', time: '~15:00', note: 'BEZ omega-3 (łosoś bogaty w EPA/DHA)', i: [
            ['Łosoś pacyficzny', 200], ['Ziemniaki', 200],
            ['Pomidory suszone', 40], ['Ananas', 30], ['Dynia', 100], ['Seler korzeń', 100], ['Sól', 2], ['Zielona herbata', 0]
        ]
    },
    {
        name: 'POSIŁEK 4 - Owsianka (Nietreningowy)', time: '~17:00', note: 'Zamiast kleiku: Płatki Owsiane, Zamiast masła orz.: Migdałowe', i: [
            ['Płatki owsiane', 40], ['Kefir 0%', 400], ['Masło migdałowe', 20], ['WPI', 35],
            ['Kakao 11%', 20], ['Maliny', 150], ['Nasiona chia', 10], ['Cynamon cejloński', 10], ['Alluloza', 10], ['Omega3 kaps', 2]
        ]
    },
    {
        name: 'POSIŁEK 5 - Kolacja + Suple Wieczór ( + Magnez)', time: '~21:00', i: [
            ['Kurczak', 200], ['Ryż basmati', 50],
            ['EVOO', 5], ['Ananas', 30], ['Papryka', 100], ['Ogórek', 100],
            ['Sól', 2], ['Zielona herbata', 0], ['Omega3 kaps', 2],
            ['Wit C 1000mg', 100], ['Maślan sodu 500mg', 100],
            ['Glicynian Mg', 5]
        ]
    },
];


function calc(name, w) {
    const d = n[name];
    if (!d) return Array(31).fill(0);
    const vals = d.map(v => (v * w) / 100);
    // NET CARBS LOGIC
    if (vals[1] > 0) {
        vals[1] = Math.max(0, vals[1] - vals[3]);
    }
    return vals;
}

const colNames = [
    'Składnik', 'Waga (g/szt)',
    'Białko (g)', 'Węglowodany (NETTO)', 'Tłuszcze (g)', 'Błonnik (g)', 'Kalorie (kcal)', 'Potas (mg)', 'Sód (mg)',
    'Tł. Nasycone (g)', 'Tł. Jednonien. (g)', 'Omega-3 (g)', 'Omega-6 (g)',
    'Błonnik Rozp. (g)', 'Błonnik Nierozp. (g)',
    'Wit. A (µg)', 'Wit. D (µg)', 'Wit. E (mg)', 'Wit. K (µg)', 'Wit. C (mg)',
    'Wit. B1 (mg)', 'Wit. B2 (mg)', 'Wit. B3 (mg)', 'Wit. B6 (mg)', 'Wit. B12 (µg)', 'Kwas Foliowy (µg)', 'Cholina (mg)',
    'Wapń (mg)', 'Żelazo (mg)', 'Magnez (mg)', 'Cynk (mg)', 'Selen (µg)', 'Fosfor (mg)'
];

const mapNtoCol = [
    0, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10,
    11, 12,
    13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 30,
    24, 25, 26, 27, 28, 29
];

async function createSheet(wb, sheetName, mealsList, includeIntra) {
    const ws = wb.addWorksheet(sheetName);
    const colWidths = [35, 10, ...Array(31).fill(12)];
    ws.columns = colWidths.map(w => ({ width: w }));

    let row = 1;
    ws.mergeCells(`A${row}:AG${row}`);
    ws.getCell(`A${row}`).value = `🥗 DIETA - ${sheetName.toUpperCase()} 🥗`;
    ws.getCell(`A${row}`).font = { bold: true, size: 16 };
    ws.getCell(`A${row}`).alignment = { horizontal: 'center' };
    ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: includeIntra ? 'FF4CAF50' : 'FF8BC34A' } };
    row += 2;

    let totalNutrients = Array(31).fill(0);
    let intraNutrients = Array(31).fill(0);

    for (const meal of mealsList) {
        ws.mergeCells(`A${row}:AG${row}`);
        ws.getCell(`A${row}`).value = `${meal.name} (${meal.time})`;
        ws.getCell(`A${row}`).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4A90A4' } };
        row++;

        if (meal.note) {
            ws.mergeCells(`A${row}:AG${row}`);
            ws.getCell(`A${row}`).value = meal.note;
            ws.getCell(`A${row}`).font = { italic: true, size: 9, color: { argb: 'FFD84315' } };
            row++;
        }

        colNames.forEach((n, i) => {
            ws.getCell(row, i + 1).value = n;
            ws.getCell(row, i + 1).font = { bold: true, size: 9 };
            ws.getCell(row, i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
            ws.getCell(row, i + 1).alignment = { horizontal: 'center' };
        });
        row++;

        let mealNutrients = Array(31).fill(0);

        for (const [name, weight] of meal.i) {
            if (name === 'Zielona herbata') {
                ws.getCell(row, 1).value = name;
                ws.getCell(row, 2).value = weight || '-';
                row++;
                continue;
            }
            const vals = calc(name, weight);
            mealNutrients = mealNutrients.map((v, i) => v + vals[i]);
            totalNutrients = totalNutrients.map((v, i) => v + vals[i]);

            ws.getCell(row, 1).value = name;
            let displayWeight = weight;
            if (name.includes('(1tab)') || name.includes('1000mg') || name.includes('500mg')) displayWeight = `${weight / 100} szt`;
            ws.getCell(row, 2).value = displayWeight;

            mapNtoCol.forEach((nIdx, cIdx) => {
                let v = vals[nIdx];
                if ([4, 5, 6, 24, 26, 29, 13, 14, 16, 30].includes(nIdx)) v = Math.round(v);
                else v = parseFloat(v.toFixed(2));
                ws.getCell(row, cIdx + 3).value = v;
                ws.getCell(row, cIdx + 3).font = { size: 9 };
            });
            row++;
        }
        ws.getCell(row, 1).value = 'SUMA';
        ws.getCell(row, 1).font = { bold: true };
        mapNtoCol.forEach((nIdx, cIdx) => {
            let v = mealNutrients[nIdx];
            if ([4, 5, 6, 24, 26, 29, 13, 14, 16, 30].includes(nIdx)) v = Math.round(v);
            else v = parseFloat(v.toFixed(2));
            ws.getCell(row, cIdx + 3).value = v;
            ws.getCell(row, cIdx + 3).font = { bold: true, size: 9 };
            ws.getCell(row, cIdx + 3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBBDEFB' } };
        });
        row += 2;
    }

    if (includeIntra) {
        ws.mergeCells(`A${row}:AG${row}`);
        ws.getCell(`A${row}`).value = `⚡ ${intra.name} (${intra.time}) - NIE WLICZANE DO SUMY GŁÓWNEJ`;
        ws.getCell(`A${row}`).font = { bold: true, size: 12 };
        ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFB300' } };
        row++;
        colNames.forEach((n, i) => {
            ws.getCell(row, i + 1).value = n;
            ws.getCell(row, i + 1).font = { bold: true, size: 9 };
            ws.getCell(row, i + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
        });
        row++;
        for (const [name, weight] of intra.i) {
            const vals = calc(name, weight);
            intraNutrients = intraNutrients.map((v, i) => v + vals[i]);
            ws.getCell(row, 1).value = name;
            ws.getCell(row, 2).value = weight;
            mapNtoCol.forEach((nIdx, cIdx) => {
                let v = vals[nIdx];
                if ([4, 5, 6, 24, 26, 29, 13, 14, 16, 30].includes(nIdx)) v = Math.round(v);
                else v = parseFloat(v.toFixed(2));
                ws.getCell(row, cIdx + 3).value = v;
            });
            row++;
        }
        ws.getCell(row, 1).value = 'SUMA INTRA';
        ws.getCell(row, 1).font = { bold: true };
        mapNtoCol.forEach((nIdx, cIdx) => {
            let v = intraNutrients[nIdx];
            if ([4, 5, 6, 24, 26, 29, 13, 14, 16, 30].includes(nIdx)) v = Math.round(v);
            else v = parseFloat(v.toFixed(2));
            ws.getCell(row, cIdx + 3).value = v;
            ws.getCell(row, cIdx + 3).font = { bold: true, size: 9 };
            ws.getCell(row, cIdx + 3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC' } };
        });
        row += 3;
    }

    // --- PODSUMOWANIE ---
    ws.mergeCells(`A${row}:E${row}`);
    ws.getCell(`A${row}`).value = '📊 PODSUMOWANIE DNIA';
    ws.getCell(`A${row}`).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF37474F' } };
    row++;

    const tableHeaders = ['Składnik', 'Ilość', '% RDI', 'Uwagi'];
    [1, 2, 3, 4].forEach((c, i) => {
        ws.getCell(row, c).value = tableHeaders[i];
        ws.getCell(row, c).font = { bold: true };
        ws.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCFD8DC' } };
    });
    row++;

    function addRow(label, value, rdiKey, unit, note = '') {
        ws.getCell(row, 1).value = label;
        ws.getCell(row, 2).value = `${value} ${unit}`;
        if (rdiKey && rdi[rdiKey]) {
            const perc = Math.round((parseFloat(value) / rdi[rdiKey]) * 100);
            ws.getCell(row, 3).value = `${perc}%`;
            if (perc < 50) ws.getCell(row, 3).font = { color: { argb: 'FFF44336' } };
            else if (perc > 100) ws.getCell(row, 3).font = { color: { argb: 'FF2E7D32' } };
        } else {
            ws.getCell(row, 3).value = '-';
        }
        ws.getCell(row, 4).value = note;
        row++;
    }

    let intraKcal = includeIntra ? Math.round(intraNutrients[4]) : 0;
    addRow('Kalorie', Math.round(totalNutrients[4]), 'kcal', 'kcal', includeIntra ? `+ Intra: ${intraKcal} kcal` : '');
    addRow('Białko', totalNutrients[0].toFixed(1), 'protein', 'g');
    addRow('Węglowodany (NETTO)', totalNutrients[1].toFixed(1), 'carbs', 'g');
    addRow('Tłuszcze Total', totalNutrients[2].toFixed(1), 'fat', 'g');
    addRow('Błonnik Całkowity', totalNutrients[3].toFixed(1), 'fiber', 'g');

    row++; ws.getCell(row, 1).value = 'Rodzaje Błonnika'; ws.getCell(row, 1).font = { italic: true }; row++;
    addRow('Błonnik Rozpuszczalny', totalNutrients[11].toFixed(1), '', 'g');
    addRow('Błonnik Nierozpuszczalny', totalNutrients[12].toFixed(1), '', 'g');

    row++; ws.getCell(row, 1).value = 'Równowaga Kwasów Tłuszczowych'; ws.getCell(row, 1).font = { italic: true }; row++;
    addRow('Nasycone (SFA)', totalNutrients[7].toFixed(1), 'sfa', 'g');
    addRow('Jednonienasycone', totalNutrients[8].toFixed(1), '', 'g');
    addRow('Omega-3', totalNutrients[9].toFixed(2), 'o3', 'g', 'Znakomity poziom');
    addRow('Omega-6', totalNutrients[10].toFixed(2), 'o6', 'g');
    const ratioO6O3 = (totalNutrients[10] / totalNutrients[9]).toFixed(1);
    addRow('Stosunek Omega-6:Omega-3', `${ratioO6O3}:1`, '', '', 'Cel: < 4:1');

    row++; ws.getCell(row, 1).value = 'Minerały i Proporcje Wodne (4L wody)'; ws.getCell(row, 1).font = { italic: true }; row++;
    const totalNa = totalNutrients[6];
    const totalK = totalNutrients[5];
    const totalMg = totalNutrients[26];
    const totalCa = totalNutrients[24];
    addRow('Sód (Na)', Math.round(totalNa), 'na', 'mg');
    addRow('Woda : Sód', `${(4500 / totalNa).toFixed(1)} : 1`, '', 'ml/mg (przy 4.5L)');
    addRow('Potas (K)', Math.round(totalK), 'k', 'mg');
    addRow('Woda : Potas', `${(4500 / totalK).toFixed(1)} : 1`, '', 'ml/mg (przy 4.5L)');
    addRow('Stosunek Potas:Sód', `${(totalK / totalNa).toFixed(1)} : 1`, '', '');
    addRow('Magnez (Mg)', Math.round(totalMg), 'mg', 'mg');
    addRow('Woda : Magnez', `${(4500 / totalMg).toFixed(1)} : 1`, '', 'ml/mg (przy 4.5L)');
    addRow('Wapń (Ca)', Math.round(totalCa), 'ca', 'mg');
    addRow('Żelazo (Fe)', totalNutrients[25].toFixed(1), 'fe', 'mg');
    addRow('Fosfor (P)', Math.round(totalNutrients[29]), 'p', 'mg');

    // --- UPDATED VITAMINS SECTION ---
    row++; ws.getCell(row, 1).value = 'Witaminy'; ws.getCell(row, 1).font = { italic: true }; row++;
    addRow('Witamina A', Math.round(totalNutrients[13]), 'vitA', 'µg');
    addRow('Witamina D', totalNutrients[14].toFixed(1), 'vitD', 'µg');
    addRow('Witamina E', totalNutrients[15].toFixed(1), 'vitE', 'mg');
    addRow('Witamina K', Math.round(totalNutrients[16]), 'vitK', 'µg');
    addRow('Witamina C', Math.round(totalNutrients[17]), 'vitC', 'mg');
    addRow('Tiamina (B1)', totalNutrients[18].toFixed(2), 'b1', 'mg');
    addRow('Ryboflawina (B2)', totalNutrients[19].toFixed(2), 'b2', 'mg');
    addRow('Niacyna (B3)', totalNutrients[20].toFixed(1), 'b3', 'mg');
    addRow('Witamina B6', totalNutrients[21].toFixed(2), 'b6', 'mg');
    addRow('Witamina B12', totalNutrients[22].toFixed(2), 'b12', 'µg');
    addRow('Kwas Foliowy', Math.round(totalNutrients[23]), 'folate', 'µg');
    addRow('Cholina (B4)', Math.round(totalNutrients[30]), 'choline', 'mg');

    // --- UPDATED FLUIDS SECTION ---
    row++;
    ws.mergeCells(`A${row}:AG${row}`);
    ws.getCell(`A${row}`).value = '💧 HARMONOGRAM PŁYNÓW (Cel: 4500-5000 ml)';
    ws.getCell(`A${row}`).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }; // Biały tekst
    ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0277BD' } }; // Ciemniejszy niebieski
    ws.getCell(`A${row}`).alignment = { horizontal: 'center' };
    row++;

    ws.getCell(row, 1).value = '1. Rano (do posiłku)'; ws.getCell(row, 2).value = '330ml'; ws.getCell(row, 3).value = 'Kawa czarna'; row++;
    ws.getCell(row, 1).value = '2. Między posiłkami 1-2'; ws.getCell(row, 2).value = '500ml'; ws.getCell(row, 3).value = 'Zielona herbata + Imbir + Cytryna'; row++;
    ws.getCell(row, 1).value = '3. Przed treningiem'; ws.getCell(row, 2).value = '1000ml'; ws.getCell(row, 3).value = 'Woda'; row++;
    ws.getCell(row, 1).value = '4. Intra Workout'; ws.getCell(row, 2).value = '1500ml'; ws.getCell(row, 3).value = 'Woda (z intra)'; row++;
    ws.getCell(row, 1).value = '5. Po treningu / Wieczór'; ws.getCell(row, 2).value = '1500ml'; ws.getCell(row, 3).value = 'Woda (łącznie do wieczora)'; row++;

    ws.mergeCells(`A${row}:AG${row}`);
    ws.getCell(`A${row}`).value = '⚠️ Pamiętaj o równomiernym nawadnianiu przez cały dzień!';
    ws.getCell(`A${row}`).font = { italic: true, size: 10, color: { argb: 'FF01579B' } };
    ws.getCell(`A${row}`).alignment = { horizontal: 'center' };
}

async function create() {
    const wb = new ExcelJS.Workbook();
    // Sheet 1: Dzień Treningowy
    await createSheet(wb, 'Treningowy', trainingMeals, true);
    // Sheet 2: Dzień Nietreningowy
    await createSheet(wb, 'Nietreningowy', nonTrainingMeals, false);

    await wb.xlsx.writeFile(filePath);
    console.log('✅ Zrobione!');
}

create().catch(console.error);
