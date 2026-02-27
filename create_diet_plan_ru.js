const ExcelJS = require('exceljs');
const path = require('path');

// Путь к файлу Excel (русская версия)
const filePath = 'C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Artem\\Dieta_Artem_RU.xlsx';

// ===========================================
// ПИЩЕВАЯ ЦЕННОСТЬ (на 100г сырого продукта)
// Источник: USDA Food Database
// Калий (мг), Натрий (мг)
// ===========================================

const nutritionData = {
    // Яичные продукты
    'Яичный белок (жидкий)': { protein: 10.9, carbs: 0.73, fat: 0.17, fiber: 0, kcal: 52, potassium: 163, sodium: 166 },
    'Целое яйцо (60г)': { protein: 12.6, carbs: 0.72, fat: 9.51, fiber: 0, kcal: 143, potassium: 138, sodium: 142 },
    'Яйца (4x60г)': { protein: 12.6, carbs: 0.72, fat: 9.51, fiber: 0, kcal: 143, potassium: 138, sodium: 142 },

    // Зерновые продукты
    'Овсяные хлопья': { protein: 13.2, carbs: 67.7, fat: 6.5, fiber: 10.1, kcal: 379, potassium: 362, sodium: 6 },
    'Рис басмати/жасмин (сухой)': { protein: 7.1, carbs: 79.0, fat: 0.6, fiber: 1.3, kcal: 352, potassium: 76, sodium: 4 },
    'Рисовая каша (сухая)': { protein: 7.0, carbs: 80.0, fat: 1.0, fiber: 0.5, kcal: 358, potassium: 76, sodium: 4 },
    'Рисовые хлебцы': { protein: 7.0, carbs: 82.0, fat: 2.5, fiber: 3.5, kcal: 387, potassium: 120, sodium: 280 },

    // Фрукты
    'Замороженная черника': { protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, kcal: 57, potassium: 77, sodium: 1 },
    'Банан': { protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, kcal: 89, potassium: 358, sodium: 1 },

    // Молочные продукты
    'Скир натуральный 0%': { protein: 11.0, carbs: 4.0, fat: 0.2, fiber: 0, kcal: 63, potassium: 150, sodium: 40 },

    // Мясо и рыба
    'Куриная грудка (сырая)': { protein: 23.1, carbs: 0, fat: 1.2, fiber: 0, kcal: 110, potassium: 256, sodium: 45 },
    'Тунец в собственном соку (консервы)': { protein: 25.5, carbs: 0, fat: 0.8, fiber: 0, kcal: 116, potassium: 237, sodium: 320 },

    // Жиры
    'Оливковое масло EVOO': { protein: 0, carbs: 0, fat: 100, fiber: 0, kcal: 884, potassium: 1, sodium: 2 },
    'Миндальная паста': { protein: 21.0, carbs: 18.8, fat: 55.5, fiber: 10.3, kcal: 614, potassium: 748, sodium: 7 },
    'Арахисовая паста': { protein: 25.0, carbs: 20.0, fat: 50.0, fiber: 6.0, kcal: 588, potassium: 649, sodium: 426 },
    'Омега-3 (рыбий жир)': { protein: 0, carbs: 0, fat: 100, fiber: 0, kcal: 900, potassium: 0, sodium: 0 },

    // Овощи
    'Тыква': { protein: 1.0, carbs: 6.5, fat: 0.1, fiber: 0.5, kcal: 26, potassium: 340, sodium: 1 },
    'Кабачок': { protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1.0, kcal: 17, potassium: 261, sodium: 8 },
    'Зелёная стручковая фасоль': { protein: 1.8, carbs: 7.0, fat: 0.1, fiber: 2.7, kcal: 31, potassium: 211, sodium: 6 },
    'Морковь': { protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, kcal: 41, potassium: 320, sodium: 69 },
    'Болгарский перец': { protein: 0.9, carbs: 6.0, fat: 0.3, fiber: 2.1, kcal: 26, potassium: 211, sodium: 4 },
    'Огурец': { protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, kcal: 15, potassium: 147, sodium: 2 },

    // Добавки
    'WPI (изолят протеина)': { protein: 90.0, carbs: 2.0, fat: 1.0, fiber: 0, kcal: 373, potassium: 150, sodium: 50 },
    'EAA': { protein: 100.0, carbs: 0, fat: 0, fiber: 0, kcal: 400, potassium: 0, sodium: 0 },
    'Декстроза': { protein: 0, carbs: 100, fat: 0, fiber: 0, kcal: 400, potassium: 0, sodium: 0 },
    'L-цитруллин': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },

    // Соль (3г = 3000мг, содержит ~1180мг натрия)
    'Соль (3г)': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 1180 },

    // Другое (нулевые значения)
    'Цейлонская корица': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
    'Кофе': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
    'Чёрный кофе': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
    'Вода': { protein: 0, carbs: 0, fat: 0, fiber: 0, kcal: 0, potassium: 0, sodium: 0 },
};

// RDI (Рекомендуемое суточное потребление)
const RDI = {
    protein: 50,      // г (базовое RDI, для спортсменов выше)
    carbs: 300,       // г
    fat: 65,          // г
    fiber: 25,        // г
    kcal: 2000,       // ккал
    potassium: 3500,  // мг
    sodium: 2300      // мг (максимум рекомендуемое)
};

// Функция расчёта макронутриентов по весу
function calculateMacros(ingredient, weightG) {
    const data = nutritionData[ingredient];
    if (!data) {
        console.log(`ВНИМАНИЕ: Нет данных для: ${ingredient}`);
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

// Цвета для приёмов пищи (пастельные, профессиональные)
const mealColors = {
    1: { header: 'FF4A90A4', row: 'FFD4E6ED' },  // Синий
    2: { header: 'FF7CB342', row: 'FFE8F5E9' },  // Зелёный (пре-тренировка)
    3: { header: 'FFFF7043', row: 'FFFBE9E7' },  // Оранжевый
    4: { header: 'FF9575CD', row: 'FFEDE7F6' },  // Фиолетовый
    5: { header: 'FFFFB300', row: 'FFFFF8E1' },  // Золотой (пери-тренировка)
    6: { header: 'FF26A69A', row: 'FFE0F2F1' },  // Морской
    summary: { header: 'FF37474F', row: 'FFECEFF1' }  // Тёмно-серый
};

// ===========================================
// ПРИЁМЫ ПИЩИ - ТРЕНИРОВОЧНЫЙ ДЕНЬ
// ===========================================

const trainingDayMeals = [
    {
        name: 'ПРИЁМ 1 - Омлет',
        time: '~7:00',
        note: '🫐 Альтернативы чернике: черная/красная смородина, малина, клубника',
        ingredients: [
            { name: 'Яичный белок (жидкий)', weight: 250 },
            { name: 'Целое яйцо (60г)', weight: 60 },
            { name: 'Овсяные хлопья', weight: 50 },
            { name: 'Замороженная черника', weight: 150 },
            { name: 'Скир натуральный 0%', weight: 150 },
            { name: 'Омега-3 (рыбий жир)', weight: 3 },
            { name: 'Цейлонская корица', weight: 0 },
            { name: 'Кофе', weight: 0 },
        ]
    },
    {
        name: 'ПРИЁМ 2 - Пре-тренировка',
        time: '~1ч до тренировки',
        ingredients: [
            { name: 'Рисовая каша (сухая)', weight: 75 },
            { name: 'Банан', weight: 120 },
            { name: 'Миндальная паста', weight: 15 },
            { name: 'WPI (изолят протеина)', weight: 40 },
            { name: 'Цейлонская корица', weight: 0 },
            { name: 'Вода', weight: 0 },
        ]
    },
    {
        name: 'ПРИЁМ 3 - Обед',
        time: '~13:00',
        vegetables: 'Тыква + Кабачок',
        note: '⚠️ МЯСО: Курицу можно заменить на свиную вырезку (БЕЗ масла), треску, индейку. \n🥔 УГЛЕВОДЫ (вместо 60г риса): Макароны (тв.сорт) 65г | Цельнозерновые 70г | Картофель 280г | Батат 240г \n🥗 ОВОЩИ (Low FODMAP): морковь, огурец, помидор, стручк. фасоль, шпинат',
        saltNote: '🧂 Добавьте 3г соли к мясу/рису',
        ingredients: [
            { name: 'Куриная грудка (сырая)', weight: 180 },
            { name: 'Оливковое масло EVOO', weight: 7 },
            { name: 'Рис басмати/жасмин (сухой)', weight: 60 },
            { name: 'Тыква', weight: 125 },
            { name: 'Кабачок', weight: 125 },
            { name: 'Соль (3г)', weight: 100 },
        ]
    },
    {
        name: 'ПРИЁМ 4 - Ужин 1',
        time: '~17:00',
        vegetables: 'Стручковая фасоль + Морковь',
        note: '⚠️ МЯСО: Курицу можно заменить на свиную вырезку (БЕЗ масла), треску, индейку. \n🥔 УГЛЕВОДЫ (вместо 60г риса): Макароны (тв.сорт) 65г | Цельнозерновые 70г | Картофель 280г | Батат 240г \n🥗 ОВОЩИ (Low FODMAP): морковь, огурец, помидор, стручк. фасоль, шпинат',
        saltNote: '🧂 Добавьте 3г соли к мясу/рису',
        ingredients: [
            { name: 'Куриная грудка (сырая)', weight: 180 },
            { name: 'Оливковое масло EVOO', weight: 7 },
            { name: 'Рис басмати/жасмин (сухой)', weight: 60 },
            { name: 'Зелёная стручковая фасоль', weight: 125 },
            { name: 'Морковь', weight: 125 },
            { name: 'Соль (3г)', weight: 100 },
        ]
    },
    {
        name: 'ПРИЁМ 5 - Пери-тренировка (Интра/Пост)',
        time: 'Во время/после тренировки',
        ingredients: [
            { name: 'EAA', weight: 20 },
            { name: 'Декстроза', weight: 20 },
            { name: 'L-цитруллин', weight: 10 },
            { name: 'Вода', weight: 0 },
        ]
    },
    {
        name: 'ПРИЁМ 6 - Ужин 2',
        time: '~21:00',
        vegetables: 'Перец + Огурец',
        note: '⚠️ МЯСО: Курицу можно заменить на свиную вырезку (БЕЗ масла), треску, индейку. \n🥔 УГЛЕВОДЫ (вместо 60г риса): Макароны (тв.сорт) 65г | Цельнозерновые 70г | Картофель 280г | Батат 240г \n🥗 ОВОЩИ (Low FODMAP): морковь, огурец, помидор, стручк. фасоль, шпинат',
        saltNote: '🧂 Добавьте 3г соли к мясу/рису',
        ingredients: [
            { name: 'Куриная грудка (сырая)', weight: 180 },
            { name: 'Оливковое масло EVOO', weight: 7 },
            { name: 'Рис басмати/жасмин (сухой)', weight: 60 },
            { name: 'Болгарский перец', weight: 125 },
            { name: 'Огурец', weight: 125 },
            { name: 'Омега-3 (рыбий жир)', weight: 3 },
            { name: 'Соль (3г)', weight: 100 },
        ]
    }
];

// ===========================================
// ПРИЁМЫ ПИЩИ - НЕТРЕНИРОВОЧНЫЙ ДЕНЬ
// ===========================================

const nonTrainingDayMeals = [
    {
        name: 'ПРИЁМ 1 - Яичница',
        time: '~7:00',
        ingredients: [
            { name: 'Яйца (4x60г)', weight: 240 },
            { name: 'Тунец в собственном соку (консервы)', weight: 120 },
            { name: 'Огурец', weight: 200 },
            { name: 'Рисовые хлебцы', weight: 30 },
            { name: 'Омега-3 (рыбий жир)', weight: 3 },
            { name: 'Чёрный кофе', weight: 0 },
        ]
    },
    {
        name: 'ПРИЁМ 2 - Обед',
        time: '~12:00',
        vegetables: 'Тыква + Кабачок',
        note: '⚠️ МЯСО: Курицу можно заменить на свиную вырезку (БЕЗ масла), треску, индейку. \n🥔 УГЛЕВОДЫ (вместо 50г риса): Макароны (тв.сорт) 55г | Цельнозерновые 60г | Картофель 230г | Батат 200г \n🥗 ОВОЩИ (Low FODMAP): морковь, огурец, помидор, стручк. фасоль, шпинат',
        saltNote: '🧂 Добавьте 3г соли к мясу/рису',
        ingredients: [
            { name: 'Куриная грудка (сырая)', weight: 180 },
            { name: 'Оливковое масло EVOO', weight: 7 },
            { name: 'Рис басмати/жасмин (сухой)', weight: 50 },
            { name: 'Тыква', weight: 125 },
            { name: 'Кабачок', weight: 125 },
            { name: 'Соль (3г)', weight: 100 },
        ]
    },
    {
        name: 'ПРИЁМ 3 - Ужин 1',
        time: '~16:00',
        vegetables: 'Стручковая фасоль + Морковь',
        note: '⚠️ МЯСО: Курицу можно заменить на свиную вырезку (БЕЗ масла), треску, индейку. \n🥔 УГЛЕВОДЫ (вместо 50г риса): Макароны (тв.сорт) 55г | Цельнозерновые 60г | Картофель 230г | Батат 200г \n🥗 ОВОЩИ (Low FODMAP): морковь, огурец, помидор, стручк. фасоль, шпинат',
        saltNote: '🧂 Добавьте 3г соли к мясу/рису',
        ingredients: [
            { name: 'Куриная грудка (сырая)', weight: 180 },
            { name: 'Оливковое масло EVOO', weight: 7 },
            { name: 'Рис басмати/жасмин (сухой)', weight: 50 },
            { name: 'Зелёная стручковая фасоль', weight: 125 },
            { name: 'Морковь', weight: 125 },
            { name: 'Соль (3г)', weight: 100 },
        ]
    },
    {
        name: 'ПРИЁМ 4 - Ужин 2',
        time: '~19:00',
        vegetables: 'Перец + Огурец',
        note: '⚠️ МЯСО: Курицу можно заменить на свиную вырезку (БЕЗ масла), треску, индейку. \n🥔 УГЛЕВОДЫ (вместо 50г риса): Макароны (тв.сорт) 55г | Цельнозерновые 60г | Картофель 230г | Батат 200г \n🥗 ОВОЩИ (Low FODMAP): морковь, огурец, помидор, стручк. фасоль, шпинат',
        saltNote: '🧂 Добавьте 3г соли к мясу/рису',
        ingredients: [
            { name: 'Куриная грудка (сырая)', weight: 180 },
            { name: 'Оливковое масло EVOO', weight: 7 },
            { name: 'Рис басмати/жасмин (сухой)', weight: 50 },
            { name: 'Болгарский перец', weight: 125 },
            { name: 'Огурец', weight: 125 },
            { name: 'Соль (3г)', weight: 100 },
        ]
    },
    {
        name: 'ПРИЁМ 5 - Поздний ужин (Омлет)',
        time: '~21:00',
        note: '🫐 Альтернативы чернике: черная/красная смородина, малина, клубника',
        ingredients: [
            { name: 'Яичный белок (жидкий)', weight: 250 },
            { name: 'Овсяные хлопья', weight: 50 },
            { name: 'Замороженная черника', weight: 150 },
            { name: 'Скир натуральный 0%', weight: 150 },
            { name: 'Арахисовая паста', weight: 15 },
            { name: 'Омега-3 (рыбий жир)', weight: 3 },
            { name: 'Цейлонская корица', weight: 0 },
        ]
    }
];

// ===========================================
// ФУНКЦИЯ СОЗДАНИЯ ЛИСТА ДИЕТЫ
// ===========================================

async function createDietSheet(workbook, sheetName, meals, dayTitle, tabColor) {
    // Удалить существующий лист, если есть
    const existingSheet = workbook.getWorksheet(sheetName);
    if (existingSheet) {
        workbook.removeWorksheet(existingSheet.id);
    }

    // Создать новый лист
    const ws = workbook.addWorksheet(sheetName, {
        properties: { tabColor: { argb: tabColor } }
    });

    // Установить ширину колонок
    ws.columns = [
        { width: 42 },  // A - Ингредиент
        { width: 12 },  // B - Вес
        { width: 10 },  // C - Белок
        { width: 14 },  // D - Углеводы
        { width: 10 },  // E - Жиры
        { width: 12 },  // F - Клетчатка
        { width: 10 },  // G - Ккал
        { width: 12 },  // H - Калий
        { width: 12 },  // I - Натрий
    ];

    let row = 1;

    // Заголовок
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

    // Информация
    ws.mergeCells(`A${row}:I${row}`);
    const infoCell = ws.getCell(`A${row}`);
    infoCell.value = 'Все веса указаны для СЫРЫХ продуктов без термической обработки';
    infoCell.font = { italic: true, size: 10, color: { argb: 'FF757575' } };
    infoCell.alignment = { horizontal: 'center' };
    row += 2;

    // Переменные для итогов
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalKcal = 0;
    let totalPotassium = 0;
    let totalSodium = 0;

    // Итерация по приёмам пищи
    for (let mealIndex = 0; mealIndex < meals.length; mealIndex++) {
        const meal = meals[mealIndex];
        const mealNum = mealIndex + 1;
        const colors = mealColors[mealNum] || mealColors[1];

        // Заголовок приёма пищи
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

        // Примечание о замене мяса
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

        // Примечание о соли
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

        // Заголовки колонок
        const headers = ['Ингредиент', 'Вес (г)', 'Белок', 'Углеводы', 'Жиры', 'Клетчатка', 'Ккал', 'Калий (мг)', 'Натрий (мг)'];
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

        // Ингредиенты
        let mealProtein = 0;
        let mealCarbs = 0;
        let mealFat = 0;
        let mealFiber = 0;
        let mealKcal = 0;
        let mealPotassium = 0;
        let mealSodium = 0;

        for (let i = 0; i < meal.ingredients.length; i++) {
            const ing = meal.ingredients[i];

            // Пропустить отображение соли как ингредиента (есть в примечании)
            if (ing.name === 'Соль (3г)') {
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

        // Сумма приёма пищи
        const sumValues = [
            `ИТОГО ${meal.name.split(' - ')[0]}`,
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

        // Добавить к общей сумме
        totalProtein += mealProtein;
        totalCarbs += mealCarbs;
        totalFat += mealFat;
        totalFiber += mealFiber;
        totalKcal += mealKcal;
        totalPotassium += mealPotassium;
    }

    // ===========================================
    // ДНЕВНОЙ ИТОГ
    // ===========================================
    row++;
    ws.mergeCells(`A${row}:I${row}`);
    const summaryHeaderCell = ws.getCell(`A${row}`);
    summaryHeaderCell.value = '📊 ИТОГ ДНЯ';
    summaryHeaderCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    summaryHeaderCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: mealColors.summary.header }
    };
    summaryHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(row).height = 30;
    row++;

    // Заголовки итогов
    const summaryHeaders = ['', '', 'Белок (г)', 'Углев. (г)', 'Жиры (г)', 'Клетч. (г)', 'Ккал', 'Калий (мг)', 'Натрий (мг)'];
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

    // Значения итогов - СУММА
    const summaryTotalValues = ['ДНЕВНАЯ СУММА', '', totalProtein.toFixed(1), totalCarbs.toFixed(1), totalFat.toFixed(1), totalFiber.toFixed(1), Math.round(totalKcal), totalPotassium, totalSodium];
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

    // Значения итогов - %RDI
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

    // Калории из макронутриентов
    const proteinKcal = totalProtein * 4;
    const carbsKcal = totalCarbs * 4;
    const fatKcal = totalFat * 9;

    ws.mergeCells(`A${row}:I${row}`);
    const kcalBreakdownCell = ws.getCell(`A${row}`);
    kcalBreakdownCell.value = `📈 Калории из макронутриентов: Белок ${Math.round(proteinKcal)} ккал | Углеводы ${Math.round(carbsKcal)} ккал | Жиры ${Math.round(fatKcal)} ккал`;
    kcalBreakdownCell.font = { size: 10, italic: true, color: { argb: 'FF616161' } };
    kcalBreakdownCell.alignment = { horizontal: 'center' };
    row++;

    // Соотношение макросов
    const totalMacros = totalProtein + totalCarbs + totalFat;
    const proteinPercent = ((totalProtein / totalMacros) * 100).toFixed(0);
    const carbsPercent = ((totalCarbs / totalMacros) * 100).toFixed(0);
    const fatPercent = ((totalFat / totalMacros) * 100).toFixed(0);

    ws.mergeCells(`A${row}:I${row}`);
    const ratioCell = ws.getCell(`A${row}`);
    ratioCell.value = `🔢 Соотношение макронутриентов: Белок ${proteinPercent}% | Углеводы ${carbsPercent}% | Жиры ${fatPercent}%`;
    ratioCell.font = { size: 10, italic: true, color: { argb: 'FF616161' } };
    ratioCell.alignment = { horizontal: 'center' };
    row += 2;

    // Легенда RDI
    ws.mergeCells(`A${row}:I${row}`);
    const rdiLegendCell = ws.getCell(`A${row}`);
    rdiLegendCell.value = `📋 RDI (Рекомендуемое суточное потребление): Белок ${RDI.protein}г | Углев. ${RDI.carbs}г | Жиры ${RDI.fat}г | Клетч. ${RDI.fiber}г | Калий ${RDI.potassium}мг | Натрий ${RDI.sodium}мг (макс)`;
    rdiLegendCell.font = { size: 9, italic: true, color: { argb: 'FF9E9E9E' } };
    rdiLegendCell.alignment = { horizontal: 'center' };
    row += 2;

    // Примечание о воде
    ws.mergeCells(`A${row}:I${row}`);
    const waterCell = ws.getCell(`A${row}`);
    waterCell.value = '💧 ПОМНИ: Пей минимум 4 литра воды в день!';
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
// ГЛАВНАЯ ФУНКЦИЯ
// ===========================================

async function createDietPlan() {
    const workbook = new ExcelJS.Workbook();

    // Создать лист для тренировочного дня
    console.log('\n📝 Создание листа: тренировочный день...');
    const trainingStats = await createDietSheet(
        workbook,
        'тренировочный день',
        trainingDayMeals,
        '🏋️ ДИЕТА - ТРЕНИРОВОЧНЫЙ ДЕНЬ 🏋️',
        'FF4A90A4'
    );

    // Создать лист для нетренировочного дня
    console.log('📝 Создание листа: нетренировочный день...');
    const nonTrainingStats = await createDietSheet(
        workbook,
        'нетренировочный день',
        nonTrainingDayMeals,
        '🛋️ ДИЕТА - НЕТРЕНИРОВОЧНЫЙ ДЕНЬ 🛋️',
        'FF7CB342'
    );

    // Сохранить файл
    await workbook.xlsx.writeFile(filePath);

    console.log(`\n✅ Файл сохранён: ${filePath}`);

    console.log(`\n📊 ИТОГ - ТРЕНИРОВОЧНЫЙ ДЕНЬ:`);
    console.log(`   Белок: ${trainingStats.totalProtein.toFixed(1)}г`);
    console.log(`   Углеводы: ${trainingStats.totalCarbs.toFixed(1)}г`);
    console.log(`   Жиры: ${trainingStats.totalFat.toFixed(1)}г`);
    console.log(`   Клетчатка: ${trainingStats.totalFiber.toFixed(1)}г`);
    console.log(`   Калории: ${Math.round(trainingStats.totalKcal)} ккал`);
    console.log(`   Калий: ${trainingStats.totalPotassium}мг`);
    console.log(`   Натрий: ${trainingStats.totalSodium}мг`);

    console.log(`\n📊 ИТОГ - НЕТРЕНИРОВОЧНЫЙ ДЕНЬ:`);
    console.log(`   Белок: ${nonTrainingStats.totalProtein.toFixed(1)}г`);
    console.log(`   Углеводы: ${nonTrainingStats.totalCarbs.toFixed(1)}г`);
    console.log(`   Жиры: ${nonTrainingStats.totalFat.toFixed(1)}г`);
    console.log(`   Клетчатка: ${nonTrainingStats.totalFiber.toFixed(1)}г`);
    console.log(`   Калории: ${Math.round(nonTrainingStats.totalKcal)} ккал`);
    console.log(`   Калий: ${nonTrainingStats.totalPotassium}мг`);
    console.log(`   Натрий: ${nonTrainingStats.totalSodium}мг`);
}

createDietPlan().catch(console.error);
