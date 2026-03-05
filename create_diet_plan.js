const ExcelJS = require('exceljs');
const path = require('path');

// Ścieżka do pliku Excel
const filePath = 'C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Artem\\Dieta_Artem.xlsx';

// ===========================================
// WARTOŚCI ODŻYWCZE (na 100g surowego produktu)
// Źródło: USDA Food Database
// Potas (mg), Sód (mg)
// ===========================================

const nutritionData = {
    // Produkty jajeczne
    'Białko jaj (płynne)': { protein: 10.9, carbs: 0.73, fat: 0.17, fiber: 0, kcal: 52, potassium: 163, sodium: 166 },
    'Jajko całe (60g)': { protein: 12.6, carbs: 0.72, fat: 9.51, fiber: 0, kcal: 143, potassium: 138, sodium: 142 },
    'Jajka (4x60g)': { protein: 12.6, carbs: 0.72, fat: 9.51, fiber: 0, kcal: 143, potassium: 138, sodium: 142 },

    // Produkty zbożowe
    'Płatki owsiane': { protein: 13.2, carbs: 67.7, fat: 6.5, fiber: 10.1, kcal: 379, potassium: 362, sodium: 6 },
    'Ryż basmati/jaśminowy (suchy)': { protein: 7.1, carbs: 79.0, fat: 0.6, fiber: 1.3, kcal: 352, potassium: 76, sodium: 4 },
    'Kleik ryżowy (suchy)': { protein: 7.0, carbs: 80.0, fat: 1.0, fiber: 0.5, kcal: 358, potassium: 76, sodium: 4 },
    'Wafle ryżowe': { protein: 7.0, carbs: 82.0, fat: 2.5, fiber: 3.5, kcal: 387, potassium: 120, sodium: 280 },

    // Owoce
    'Borówki mrożone': { protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, kcal: 57, potassium: 77, sodium: 1 },
    'Banan': { protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, kcal: 89, potassium: 358, sodium: 1 },

    // Nabiał
    'Skyr naturalny 0%': { protein: 11.0, carbs: 4.0, fat: 0.2, fiber: 0, kcal: 63, potassium: 150, sodium: 40 },

    // Mięso i ryby
    'Pierś z kurczaka (surowa)': { protein: 23.1, carbs: 0, fat: 1.2, fiber: 0, kcal: 110, potassium: 256, sodium: 45 },
    'Tuńczyk w sosie własnym (puszka)': { protein: 25.5, carbs: 0, fat: 0.8, fiber: 0, kcal: 116, potassium: 237, sodium: 320 },

    // Tłuszcze
    'Oliwa z oliwek EVOO': { protein: 0, carbs: 0, fat: 100, fiber: 0, kcal: 884, potassium: 1, sodium: 2 },
    'Masło migdałowe': { protein: 21.0, carbs: 18.8, fat: 55.5, fiber: 10.3, kcal: 614, potassium: 748, sodium: 7 },
    'Masło orzechowe': { protein: 25.0, carbs: 20.0, fat: 50.0, fiber: 6.0, kcal: 588, potassium: 649, sodium: 426 },
    'Omega-3 (olej rybi)': { protein: 0, carbs: 0, fat: 100, fiber: 0, kcal: 900, potassium: 0, sodium: 0 },

    // Warzywa
    'Dynia': { protein: 1.0, carbs: 6.5, fat: 0.1, fiber: 0.5, kcal: 26, potassium: 340, sodium: 1 },
    'Cukinia': { protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1.0, kcal: 17, potassium: 261, sodium: 8 },
    'Fasolka szparagowa zielona': { protein: 1.8, carbs: 7.0, fat: 0.1, fiber: 2.7, kcal: 31, potassium: 211, sodium: 6 },
    'Marchewka': { protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, kcal: 41, potassium: 320, sodium: 69 },
    'Papryka': { protein: 0.9, carbs: 6.0, fat: 0.3, fiber: 2.1, kcal: 26, potassium: 211, sodium: 4 },
    'Ogórek': { protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, kcal: 15, potassium: 147, sodium: 2 },

    // Suplementy
    'WPI (izolat białka)': { protein: 90.0, carbs: 2.0, fat: 1.0, fiber: 0, kcal: 373, potassium: 150, sodium: 50 },
    'EAA': { protein: 100.0, carbs: 0, fat: 0, fiber: 0, kcal: 400, potassium: 0, sodium: 0 },
    'Dekstroza': { protein: 0, carbs: 100, fat: 0, fiber: 0, kcal: 400, potassium: 0, sodium: 0 },
    'L-cytrulina': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },

    // Sól (3g = 3000mg, zawiera ~1180mg sodu)
    'Sól (3g)': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 1180 },

    // Inne (zerowe wartości)
    'Cynamon cejloński': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
    'Kawa': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
    'Czarna kawa': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
    'Woda': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
};

// RDI (Recommended Daily Intake) - zalecane dzienne spożycie
const RDI = {
    protein: 50,      // g (bazowe RDI, dla sportowców wyższe)
    carbs: 300,       // g
    fat: 65,          // g
    fiber: 25,        // g
    kcal: 2000,       // kcal
    potassium: 3500,  // mg
    sodium: 2300      // mg (max zalecane)
};

// Funkcja do obliczania makroskładników na podstawie wagi
function calculateMacros(ingredient, weightG) {
    const data = nutritionData[ingredient];
    if (!data) {
        console.log(`UWAGA: Brak danych dla: ${ingredient}`);
        return { weight: weightG, protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 };
    }
    return {
        weight: weightG,
        protein: parseFloat(((data.protein * weightG) / 100).toFixed(1)),
        carbs: parseFloat(((data.carbs * weightG) / 100).toFixed(1)),
        fat: parseFloat(((data.fat * weightG) / 100).toFixed(1)),
        fiber: parseFloat(((data.fiber * weightG) / 100).toFixed(1)),
        kcal: Math.round((data.kcal * weightG) / 100),
        potassium: Math.round((data.potassium * weightG) / 100),
        sodium: Math.round((data.sodium * weightG) / 100)
    };
}

// Kolory dla posiłków (pastelowe, profesjonalne)
const mealColors = {
    1: { header: 'FF4A90A4', row: 'FFD4E6ED' },  // Niebieski
    2: { header: 'FF7CB342', row: 'FFE8F5E9' },  // Zielony (pre-workout)
    3: { header: 'FFFF7043', row: 'FFFBE9E7' },  // Pomarańczowy
    4: { header: 'FF9575CD', row: 'FFEDE7F6' },  // Fioletowy
    5: { header: 'FFFFB300', row: 'FFFFF8E1' },  // Złoty (peri-workout)
    6: { header: 'FF26A69A', row: 'FFE0F2F1' },  // Morski
    summary: { header: 'FF37474F', row: 'FFECEFF1' }  // Ciemny szary
};

// ===========================================
// DEFINICJE POSIŁKÓW - DZIEŃ TRENINGOWY
// ===========================================

const trainingDayMeals = [
    {
        name: 'POSIŁEK 1 - Omlet',
        time: '~7:00',
        ingredients: [
            { name: 'Białko jaj (płynne)', weight: 250 },
            { name: 'Jajko całe (60g)', weight: 60 },
            { name: 'Płatki owsiane', weight: 50 },
            { name: 'Borówki mrożone', weight: 150 },
            { name: 'Skyr naturalny 0%', weight: 150 },
            { name: 'Omega-3 (olej rybi)', weight: 3 },
            { name: 'Cynamon cejloński', weight: 0 },
            { name: 'Kawa', weight: 0 },
        ]
    },
    {
        name: 'POSIŁEK 2 - Pre-Workout',
        time: '~1h przed treningiem',
        ingredients: [
            { name: 'Kleik ryżowy (suchy)', weight: 75 },
            { name: 'Banan', weight: 120 },
            { name: 'Masło migdałowe', weight: 15 },
            { name: 'WPI (izolat białka)', weight: 40 },
            { name: 'Cynamon cejloński', weight: 0 },
            { name: 'Woda', weight: 0 },
        ]
    },
    {
        name: 'POSIŁEK 3 - Obiad',
        time: '~13:00',
        vegetables: 'Dynia + Cukinia',
        note: '⚠️ 180g kurczaka można zamienić na: dorsza/indyka LUB łososia pacyficznego (bez EVOO)',
        saltNote: '🧂 Dodaj 3g soli do mięsa/ryżu',
        ingredients: [
            { name: 'Pierś z kurczaka (surowa)', weight: 180 },
            { name: 'Oliwa z oliwek EVOO', weight: 7 },
            { name: 'Ryż basmati/jaśminowy (suchy)', weight: 60 },
            { name: 'Dynia', weight: 125 },
            { name: 'Cukinia', weight: 125 },
            { name: 'Sól (3g)', weight: 100 },
        ]
    },
    {
        name: 'POSIŁEK 4 - Kolacja 1',
        time: '~17:00',
        vegetables: 'Fasolka szparagowa + Marchewka',
        note: '⚠️ 180g kurczaka można zamienić na: dorsza/indyka LUB łososia pacyficznego (bez EVOO)',
        saltNote: '🧂 Dodaj 3g soli do mięsa/ryżu',
        ingredients: [
            { name: 'Pierś z kurczaka (surowa)', weight: 180 },
            { name: 'Oliwa z oliwek EVOO', weight: 7 },
            { name: 'Ryż basmati/jaśminowy (suchy)', weight: 60 },
            { name: 'Fasolka szparagowa zielona', weight: 125 },
            { name: 'Marchewka', weight: 125 },
            { name: 'Sól (3g)', weight: 100 },
        ]
    },
    {
        name: 'POSIŁEK 5 - Peri-Workout (Intra/Post)',
        time: 'Podczas/po treningu',
        ingredients: [
            { name: 'EAA', weight: 20 },
            { name: 'Dekstroza', weight: 20 },
            { name: 'L-cytrulina', weight: 10 },
            { name: 'Woda', weight: 0 },
        ]
    },
    {
        name: 'POSIŁEK 6 - Kolacja 2',
        time: '~21:00',
        vegetables: 'Papryka + Ogórek',
        note: '⚠️ 180g kurczaka można zamienić na: dorsza/indyka LUB łososia pacyficznego (bez EVOO)',
        saltNote: '🧂 Dodaj 3g soli do mięsa/ryżu',
        ingredients: [
            { name: 'Pierś z kurczaka (surowa)', weight: 180 },
            { name: 'Oliwa z oliwek EVOO', weight: 7 },
            { name: 'Ryż basmati/jaśminowy (suchy)', weight: 60 },
            { name: 'Papryka', weight: 125 },
            { name: 'Ogórek', weight: 125 },
            { name: 'Omega-3 (olej rybi)', weight: 3 },
            { name: 'Sól (3g)', weight: 100 },
        ]
    }
];

// ===========================================
// DEFINICJE POSIŁKÓW - DZIEŃ NIETRENINGOWY
// ===========================================

const nonTrainingDayMeals = [
    {
        name: 'POSIŁEK 1 - Jajecznica',
        time: '~7:00',
        ingredients: [
            { name: 'Jajka (4x60g)', weight: 240 },
            { name: 'Tuńczyk w sosie własnym (puszka)', weight: 120 },
            { name: 'Ogórek', weight: 200 },
            { name: 'Wafle ryżowe', weight: 30 },
            { name: 'Omega-3 (olej rybi)', weight: 3 },
            { name: 'Czarna kawa', weight: 0 },
        ]
    },
    {
        name: 'POSIŁEK 2 - Obiad',
        time: '~12:00',
        vegetables: 'Dynia + Cukinia',
        note: '⚠️ 180g kurczaka można zamienić na: dorsza/indyka LUB łososia pacyficznego (bez EVOO)',
        saltNote: '🧂 Dodaj 3g soli do mięsa/ryżu',
        ingredients: [
            { name: 'Pierś z kurczaka (surowa)', weight: 180 },
            { name: 'Oliwa z oliwek EVOO', weight: 7 },
            { name: 'Ryż basmati/jaśminowy (suchy)', weight: 50 },
            { name: 'Dynia', weight: 125 },
            { name: 'Cukinia', weight: 125 },
            { name: 'Sól (3g)', weight: 100 },
        ]
    },
    {
        name: 'POSIŁEK 3 - Kolacja 1',
        time: '~16:00',
        vegetables: 'Fasolka szparagowa + Marchewka',
        note: '⚠️ 180g kurczaka można zamienić na: dorsza/indyka LUB łososia pacyficznego (bez EVOO)',
        saltNote: '🧂 Dodaj 3g soli do mięsa/ryżu',
        ingredients: [
            { name: 'Pierś z kurczaka (surowa)', weight: 180 },
            { name: 'Oliwa z oliwek EVOO', weight: 7 },
            { name: 'Ryż basmati/jaśminowy (suchy)', weight: 50 },
            { name: 'Fasolka szparagowa zielona', weight: 125 },
            { name: 'Marchewka', weight: 125 },
            { name: 'Sól (3g)', weight: 100 },
        ]
    },
    {
        name: 'POSIŁEK 4 - Kolacja 2',
        time: '~19:00',
        vegetables: 'Papryka + Ogórek',
        note: '⚠️ 180g kurczaka można zamienić na: dorsza/indyka LUB łososia pacyficznego (bez EVOO)',
        saltNote: '🧂 Dodaj 3g soli do mięsa/ryżu',
        ingredients: [
            { name: 'Pierś z kurczaka (surowa)', weight: 180 },
            { name: 'Oliwa z oliwek EVOO', weight: 7 },
            { name: 'Ryż basmati/jaśminowy (suchy)', weight: 50 },
            { name: 'Papryka', weight: 125 },
            { name: 'Ogórek', weight: 125 },
            { name: 'Sól (3g)', weight: 100 },
        ]
    },
    {
        name: 'POSIŁEK 5 - Późna Kolacja (Omlet)',
        time: '~21:00',
        ingredients: [
            { name: 'Białko jaj (płynne)', weight: 250 },
            { name: 'Płatki owsiane', weight: 50 },
            { name: 'Borówki mrożone', weight: 150 },
            { name: 'Skyr naturalny 0%', weight: 150 },
            { name: 'Masło orzechowe', weight: 15 },
            { name: 'Omega-3 (olej rybi)', weight: 3 },
            { name: 'Cynamon cejloński', weight: 0 },
        ]
    }
];

// ===========================================
// FUNKCJA DO TWORZENIA ARKUSZA DIETY
// ===========================================

async function createDietSheet(workbook, sheetName, meals, dayTitle, tabColor) {
    // Usuń istniejący arkusz jeśli istnieje
    const existingSheet = workbook.getWorksheet(sheetName);
    if (existingSheet) {
        workbook.removeWorksheet(existingSheet.id);
    }

    // Utwórz nowy arkusz
    const ws = workbook.addWorksheet(sheetName, {
        properties: { tabColor: { argb: tabColor } }
    });

    // Ustaw szerokości kolumn (rozszerzone o potas, sód, %RDI)
    ws.columns = [
        { width: 40 },  // A - Składnik
        { width: 12 },  // B - Waga
        { width: 10 },  // C - Białko
        { width: 14 },  // D - Węglowodany
        { width: 10 },  // E - Tłuszcze
        { width: 10 },  // F - Błonnik
        { width: 10 },  // G - Kcal
        { width: 12 },  // H - Potas
        { width: 10 },  // I - Sód
    ];

    let row = 1;

    // Tytuł
    ws.mergeCells(`A${row}:I${row}`);
    const titleCell = ws.getCell(`A${row}`);
    titleCell.value = dayTitle;
    titleCell.font = { bold: true, size: 18, color: { argb: 'FF1A237E' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8EAF6' }
    };
    ws.getRow(row).height = 35;
    row += 2;

    // Info
    ws.mergeCells(`A${row}:I${row}`);
    const infoCell = ws.getCell(`A${row}`);
    infoCell.value = 'Wszystkie wagi podane dla SUROWYCH produktów niepoddanych obróbce termicznej';
    infoCell.font = { italic: true, size: 10, color: { argb: 'FF757575' } };
    infoCell.alignment = { horizontal: 'center' };
    row += 2;

    // Zmienne do podsumowania
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalKcal = 0;
    let totalPotassium = 0;
    let totalSodium = 0;

    // Iteracja przez posiłki
    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
        const meal = meals[mealIndex];
        const mealNum = mealIndex + 1;
        const colors = mealColors[mealNum] || mealColors[1];

        // Nagłówek posiłku
        ws.mergeCells(`A${row}:I${row}`);
        const mealHeaderCell = ws.getCell(`A${row}`);
        mealHeaderCell.value = `${meal.name} (${meal.time})`;
        mealHeaderCell.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
        mealHeaderCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.header }
        };
        mealHeaderCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
        ws.getRow(row).height = 28;
        row++;

        // Adnotacja o zamianie mięsa jeśli istnieje
        if (meal.note) {
            ws.mergeCells(`A${row}:I${row}`);
            const noteCell = ws.getCell(`A${row}`);
            noteCell.value = meal.note;
            noteCell.font = { italic: true, size: 9, color: { argb: 'FFD84315' } };
            noteCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFF3E0' }
            };
            noteCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
            ws.getRow(row).height = 20;
            row++;
        }

        // Adnotacja o soli jeśli istnieje
        if (meal.saltNote) {
            ws.mergeCells(`A${row}:I${row}`);
            const saltCell = ws.getCell(`A${row}`);
            saltCell.value = meal.saltNote;
            saltCell.font = { italic: true, size: 9, color: { argb: 'FF1565C0' } };
            saltCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE3F2FD' }
            };
            saltCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
            ws.getRow(row).height = 20;
            row++;
        }

        // Nagłówki kolumn
        const headers = ['Składnik', 'Waga (g)', 'Białko', 'Węglowodany', 'Tłuszcze', 'Błonnik', 'Kcal', 'Potas (mg)', 'Sód (mg)'];
        for (let col = 1; col <= 9; col++) {
            const cell = ws.getCell(row, col);
            cell.value = headers[col - 1];
            cell.font = { bold: true, size: 10, color: { argb: 'FF37474F' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFB0BEC5' }
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF90A4AE' } },
                bottom: { style: 'thin', color: { argb: 'FF90A4AE' } },
                left: { style: 'thin', color: { argb: 'FF90A4AE' } },
                right: { style: 'thin', color: { argb: 'FF90A4AE' } }
            };
        }
        row++;

        // Składniki
        let mealProtein = 0;
        let mealCarbs = 0;
        let mealFat = 0;
        let mealFiber = 0;
        let mealKcal = 0;
        let mealPotassium = 0;
        let mealSodium = 0;

        for (let i = 0; i < meal.ingredients.length; i++) {
            const ing = meal.ingredients[i];

            // Pomijaj wyświetlanie soli jako składnika (jest w adnotacji)
            if (ing.name === 'Sól (3g)') {
                const macros = calculateMacros(ing.name, ing.weight);
                mealSodium += macros.sodium;
                totalSodium += macros.sodium;
                continue;
            }

            const macros = calculateMacros(ing.name, ing.weight);

            mealProtein += macros.protein;
            mealCarbs += macros.carbs;
            mealFat += macros.fat;
            mealFiber += macros.fiber;
            mealKcal += macros.kcal;
            mealPotassium += macros.potassium;
            mealSodium += macros.sodium;

            const rowBgColor = i % 2 === 0 ? colors.row : 'FFFFFFFF';
            const values = [
                ing.name,
                ing.weight > 0 ? ing.weight : '-',
                macros.protein.toFixed(1),
                macros.carbs.toFixed(1),
                macros.fat.toFixed(1),
                macros.fiber.toFixed(1),
                macros.kcal,
                macros.potassium,
                macros.sodium
            ];

            for (let col = 1; col <= 9; col++) {
                const cell = ws.getCell(row, col);
                cell.value = values[col - 1];
                cell.font = { size: 10 };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: rowBgColor }
                };
                cell.alignment = {
                    horizontal: col === 1 ? 'left' : 'center',
                    vertical: 'middle',
                    indent: col === 1 ? 1 : 0
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                    right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                };
            }
            row++;
        }

        // Suma posiłku
        const sumValues = [
            `SUMA ${meal.name.split(' - ')[0]}`,
            '',
            mealProtein.toFixed(1),
            mealCarbs.toFixed(1),
            mealFat.toFixed(1),
            mealFiber.toFixed(1),
            Math.round(mealKcal),
            mealPotassium,
            mealSodium
        ];

        for (let col = 1; col <= 9; col++) {
            const cell = ws.getCell(row, col);
            cell.value = sumValues[col - 1];
            cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: colors.header }
            };
            cell.alignment = {
                horizontal: col === 1 ? 'left' : 'center',
                vertical: 'middle',
                indent: col === 1 ? 1 : 0
            };
            cell.border = {
                top: { style: 'medium', color: { argb: 'FF424242' } },
                bottom: { style: 'medium', color: { argb: 'FF424242' } },
                left: { style: 'thin', color: { argb: 'FF424242' } },
                right: { style: 'thin', color: { argb: 'FF424242' } }
            };
        }
        ws.getRow(row).height = 22;
        row += 2;

        // Dodaj do sumy całkowitej
        totalProtein += mealProtein;
        totalCarbs += mealCarbs;
        totalFat += mealFat;
        totalFiber += mealFiber;
        totalKcal += mealKcal;
        totalPotassium += mealPotassium;
    }

    // ===========================================
    // PODSUMOWANIE CAŁODZIENNE
    // ===========================================
    row++;
    ws.mergeCells(`A${row}:I${row}`);
    const summaryHeaderCell = ws.getCell(`A${row}`);
    summaryHeaderCell.value = '📊 PODSUMOWANIE DNIA';
    summaryHeaderCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    summaryHeaderCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: mealColors.summary.header }
    };
    summaryHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(row).height = 30;
    row++;

    // Nagłówki podsumowania
    const summaryHeaders = ['', '', 'Białko (g)', 'Węglow. (g)', 'Tłuszcze (g)', 'Błonnik (g)', 'Kcal', 'Potas (mg)', 'Sód (mg)'];
    for (let col = 1; col <= 9; col++) {
        const cell = ws.getCell(row, col);
        cell.value = summaryHeaders[col - 1];
        cell.font = { bold: true, size: 11 };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFB0BEC5' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
    row++;

    // Wartości podsumowania - SUMA
    const summaryTotalValues = ['SUMA DZIENNA', '', totalProtein.toFixed(1), totalCarbs.toFixed(1), totalFat.toFixed(1), totalFiber.toFixed(1), Math.round(totalKcal), totalPotassium, totalSodium];
    for (let col = 1; col <= 9; col++) {
        const cell = ws.getCell(row, col);
        cell.value = summaryTotalValues[col - 1];
        cell.font = { bold: true, size: 12, color: { argb: 'FF1B5E20' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC8E6C9' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'medium', color: { argb: 'FF1B5E20' } },
            bottom: { style: 'medium', color: { argb: 'FF1B5E20' } },
            left: { style: 'thin', color: { argb: 'FF1B5E20' } },
            right: { style: 'thin', color: { argb: 'FF1B5E20' } }
        };
    }
    ws.getRow(row).height = 28;
    row++;

    // Wartości podsumowania - %RDI
    const rdiPercent = {
        protein: ((totalProtein / RDI.protein) * 100).toFixed(0),
        carbs: ((totalCarbs / RDI.carbs) * 100).toFixed(0),
        fat: ((totalFat / RDI.fat) * 100).toFixed(0),
        fiber: ((totalFiber / RDI.fiber) * 100).toFixed(0),
        kcal: ((totalKcal / RDI.kcal) * 100).toFixed(0),
        potassium: ((totalPotassium / RDI.potassium) * 100).toFixed(0),
        sodium: ((totalSodium / RDI.sodium) * 100).toFixed(0)
    };

    const rdiValues = ['% RDI', '', `${rdiPercent.protein}%`, `${rdiPercent.carbs}%`, `${rdiPercent.fat}%`, `${rdiPercent.fiber}%`, `${rdiPercent.kcal}%`, `${rdiPercent.potassium}%`, `${rdiPercent.sodium}%`];
    for (let col = 1; col <= 9; col++) {
        const cell = ws.getCell(row, col);
        cell.value = rdiValues[col - 1];
        cell.font = { bold: true, size: 11, color: { argb: 'FF0D47A1' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFBBDEFB' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FF0D47A1' } },
            bottom: { style: 'medium', color: { argb: 'FF0D47A1' } },
            left: { style: 'thin', color: { argb: 'FF0D47A1' } },
            right: { style: 'thin', color: { argb: 'FF0D47A1' } }
        };
    }
    ws.getRow(row).height = 24;
    row += 2;

    // Kalorie z makroskładników
    const proteinKcal = totalProtein * 4;
    const carbsKcal = totalCarbs * 4;
    const fatKcal = totalFat * 9;

    ws.mergeCells(`A${row}:I${row}`);
    const kcalBreakdownCell = ws.getCell(`A${row}`);
    kcalBreakdownCell.value = `📈 Kalorie z makroskładników: Białko ${Math.round(proteinKcal)} kcal | Węglowodany ${Math.round(carbsKcal)} kcal | Tłuszcze ${Math.round(fatKcal)} kcal`;
    kcalBreakdownCell.font = { size: 10, italic: true, color: { argb: 'FF616161' } };
    kcalBreakdownCell.alignment = { horizontal: 'center' };
    row++;

    // Proporcje makros
    const totalMacros = totalProtein + totalCarbs + totalFat;
    const proteinPercent = ((totalProtein / totalMacros) * 100).toFixed(0);
    const carbsPercent = ((totalCarbs / totalMacros) * 100).toFixed(0);
    const fatPercent = ((totalFat / totalMacros) * 100).toFixed(0);

    ws.mergeCells(`A${row}:I${row}`);
    const ratioCell = ws.getCell(`A${row}`);
    ratioCell.value = `🔢 Proporcje makroskładników: Białko ${proteinPercent}% | Węglowodany ${carbsPercent}% | Tłuszcze ${fatPercent}%`;
    ratioCell.font = { size: 10, italic: true, color: { argb: 'FF616161' } };
    ratioCell.alignment = { horizontal: 'center' };
    row += 2;

    // Legenda RDI
    ws.mergeCells(`A${row}:I${row}`);
    const rdiLegendCell = ws.getCell(`A${row}`);
    rdiLegendCell.value = `📋 RDI (Zalecane dzienne spożycie): Białko ${RDI.protein}g | Węgl. ${RDI.carbs}g | Tłuszcze ${RDI.fat}g | Błonnik ${RDI.fiber}g | Potas ${RDI.potassium}mg | Sód ${RDI.sodium}mg (max)`;
    rdiLegendCell.font = { size: 9, italic: true, color: { argb: 'FF9E9E9E' } };
    rdiLegendCell.alignment = { horizontal: 'center' };
    row += 2;

    // Adnotacja o wodzie
    ws.mergeCells(`A${row}:I${row}`);
    const waterCell = ws.getCell(`A${row}`);
    waterCell.value = '💧 PAMIĘTAJ: Wypij minimum 4 litry wody dziennie!';
    waterCell.font = { bold: true, size: 12, color: { argb: 'FF1565C0' } };
    waterCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE3F2FD' }
    };
    waterCell.alignment = { horizontal: 'center', vertical: 'middle' };
    waterCell.border = {
        top: { style: 'medium', color: { argb: 'FF1565C0' } },
        bottom: { style: 'medium', color: { argb: 'FF1565C0' } },
        left: { style: 'medium', color: { argb: 'FF1565C0' } },
        right: { style: 'medium', color: { argb: 'FF1565C0' } }
    };
    ws.getRow(row).height = 28;

    return { totalProtein, totalCarbs, totalFat, totalFiber, totalKcal, totalPotassium, totalSodium };
}

// ===========================================
// FUNKCJA GŁÓWNA
// ===========================================

async function createDietPlan() {
    const workbook = new ExcelJS.Workbook();

    // Próba otwarcia istniejącego pliku lub utworzenie nowego
    try {
        await workbook.xlsx.readFile(filePath);
        console.log('Otwarto istniejący plik Excel');
    } catch (e) {
        console.log('Tworzenie nowego pliku Excel');
    }

    // Utwórz arkusz dla dnia treningowego
    console.log('\n📝 Tworzenie arkusza: dzień treningowy...');
    const trainingStats = await createDietSheet(
        workbook,
        'dzień treningowy',
        trainingDayMeals,
        '🏋️ DIETA - DZIEŃ TRENINGOWY 🏋️',
        'FF4A90A4'
    );

    // Utwórz arkusz dla dnia nietreningowego
    console.log('📝 Tworzenie arkusza: dzień nietreningowy...');
    const nonTrainingStats = await createDietSheet(
        workbook,
        'dzień nietreningowy',
        nonTrainingDayMeals,
        '🛋️ DIETA - DZIEŃ NIETRENINGOWY 🛋️',
        'FF7CB342'
    );

    // Zapisz plik
    await workbook.xlsx.writeFile(filePath);

    console.log(`\n✅ Plik zapisany: ${filePath}`);

    console.log(`\n📊 PODSUMOWANIE - DZIEŃ TRENINGOWY:`);
    console.log(`   Białko: ${trainingStats.totalProtein.toFixed(1)}g`);
    console.log(`   Węglowodany: ${trainingStats.totalCarbs.toFixed(1)}g`);
    console.log(`   Tłuszcze: ${trainingStats.totalFat.toFixed(1)}g`);
    console.log(`   Błonnik: ${trainingStats.totalFiber.toFixed(1)}g`);
    console.log(`   Kalorie: ${Math.round(trainingStats.totalKcal)} kcal`);
    console.log(`   Potas: ${trainingStats.totalPotassium}mg`);
    console.log(`   Sód: ${trainingStats.totalSodium}mg`);

    console.log(`\n📊 PODSUMOWANIE - DZIEŃ NIETRENINGOWY:`);
    console.log(`   Białko: ${nonTrainingStats.totalProtein.toFixed(1)}g`);
    console.log(`   Węglowodany: ${nonTrainingStats.totalCarbs.toFixed(1)}g`);
    console.log(`   Tłuszcze: ${nonTrainingStats.totalFat.toFixed(1)}g`);
    console.log(`   Błonnik: ${nonTrainingStats.totalFiber.toFixed(1)}g`);
    console.log(`   Kalorie: ${Math.round(nonTrainingStats.totalKcal)} kcal`);
    console.log(`   Potas: ${nonTrainingStats.totalPotassium}mg`);
    console.log(`   Sód: ${nonTrainingStats.totalSodium}mg`);
}

createDietPlan().catch(console.error);
