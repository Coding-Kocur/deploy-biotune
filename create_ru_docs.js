const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = require("docx");
const fs = require("fs");
const path = require("path");

const outputDir = "C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Artem";

// ==========================================
// TRANSLATIONS
// ==========================================

const trainingPlanRU = [
    { type: 'h1', text: 'День 1 (Жим / Push):' },
    { type: 'p', text: '3 мин кардио на эллипсе/велотренажере до 140 уд/мин + разминка (с акцентом на вращательную манжету плеча!)' },
    { type: 'p', text: '' },
    { type: 'list', text: 'Жим гантелей на наклонной скамье (Incline press): 3 сета, 8-12 повторений, RIR: 1, Темп: 2/1/1/0' },
    { type: 'list', text: 'Отжимания на брусьях с весом (Dipy): 2 сета, 8-12 повт, RIR: 1, 1/1/1/0' },
    { type: 'list', text: 'Разгибания на трицепс (Katana extension) на нижнем блоке (косички): 3 сета, 8-12 повт, RIR: 0, 2/1/1/0' },
    { type: 'list', text: 'Разводка (на кроссовере сверху или тренажер pec fly): 3 сета + дроп-сет (~60% веса на основном, затем 40%), 8-15 повт, RIR: 0, 2/1/2/1' },
    { type: 'list', text: 'Махи в стороны (Laterale) по одной руке на блоке: 2 упражнения по 2 сета, 8-12 повт, RIR: 0, 3/0/1/0' },
    { type: 'p', text: '' },
    { type: 'h1', text: 'День 2 (Тяга / Pull):' },
    { type: 'p', text: '3 мин кардио на эллипсе/велотренажере до 140 уд/мин + разминка (с акцентом на вращательную манжету плеча!)' },
    { type: 'p', text: '' },
    { type: 'list', text: 'Тяга верхнего блока узким хватом (Lat pulldown): 2 сета, 8-12 повт, RIR: 1, 2/0/X/0' },
    { type: 'list', text: 'Тяга Т-грифа с упором или тяга штанги лежа на скамье (Seal row): 4 сета, 5-8 повт (тяжело), RIR: 1, 2/1/1/0' },
    { type: 'list', text: 'Пуловер (Lat pullover) в кроссовере: 2 сета + дроп-сет (~60% веса, потом 40%), 8-12 повт, RIR: 0, 2/1/1/0' },
    { type: 'list', text: 'Махи на заднюю дельту (Rear delt fly) или тяга к лицу (face pulls): 3 сета, 10-15 повт, RIR: 0, 2/0/X/0' },
    { type: 'list', text: 'Сгибание на бицепс с гантелями на наклонной скамье: 3 сета, 8-12 повт, RIR: 0, 3/0/1/0' },
    { type: 'list', text: 'Скручивания на пресс в тренажере (Ab crunche): 3 сета, 10-15 повт, RIR: 0, 2/1/1/0' },
    { type: 'p', text: '' },
    { type: 'h1', text: 'День 3 (Ноги A):' },
    { type: 'p', text: '3 мин велотренажер / ходьба в гору + разминка' },
    { type: 'p', text: '' },
    { type: 'list', text: 'Гакк-приседания / Жим ногами (Hack squat / сувница) (стопы как можно ниже для макс. акцента на квадрицепс, но не отрывая пяток): 4 сета, 5-8 повт, RIR: 2, 1/1/1/1' },
    { type: 'list', text: 'Разгибания ног (Leg extension) (спинку макс. назад для большего угла в тазу): 3 сета + дроп-сет (~60% веса, потом 40%), 10-15 повт, RIR: 0, 3/0/X/0' },
    { type: 'list', text: 'Болгарские выпады с гантелями с упором на скамью: 2 упр по 2 сета, 10-15 повт, RIR: 1, 2/1/1/0' },
    { type: 'list', text: 'Сведение ног (Hip adductor): 3 сета, 10-15 повт, RIR: 0, 3/0/1/1' },
    { type: 'p', text: '10 мин велотренажер - легкое кардио 2 зоны (улучшает восстановление и уменьшает крепатуру)' },
    { type: 'p', text: '' },
    { type: 'h1', text: 'День 4 – Отдых (Rest)' },
    { type: 'p', text: '' },
    { type: 'h1', text: 'День 5 (Верх / Upper):' },
    { type: 'p', text: '3 мин кардио на эллипсе/велотренажере до 140 уд/мин + разминка (с акцентом на вращательную манжету!)' },
    { type: 'p', text: '' },
    { type: 'list', text: 'Подтягивания прямым хватом (с доп. весом): 3 сета, 8-12 повт, RIR: 1, 2/1/X/0' },
    { type: 'list', text: 'Жим в тренажере (Wide press) или жим гантелей на горизонтальной скамье: 3 сета, 8-12 повт, RIR: 1, 2/0/X/0' },
    { type: 'list', text: 'Тяга в тренажере широким хватом (упор в грудь) или тяга блока (широко): 2 сета, 5-8 повт (тяжело), RIR: 1, 2/1/1/0' },
    { type: 'list', text: 'Жим гантелей сидя (OHP): 2 сета, 6-10 повт, RIR: 1, 2/0/1/0' },
    { type: 'list', text: 'Разгибания на трицепс кросс-кабель (Cross cable triceps extension): 2 сета, 8-12 повт, RIR: 0, 2/0/X/1' },
    { type: 'list', text: 'Сгибание на бицепс с EZ-штангой: 2 сета, 8-12 повт, RIR: 0, 1/0/X/0' },
    { type: 'p', text: '' },
    { type: 'h1', text: 'День 6 (Ноги B):' },
    { type: 'list', text: 'Румнская тяга (RDL) с гантелями (упор о Смит/стойку): 4 сета, 6-10 повт, RIR: 1, 3/1/1/0' },
    { type: 'list', text: 'Ягодичный мост (Hip thrust): 3 сета, 8-12 повт, RIR: 1, 2/1/X/1' },
    { type: 'list', text: 'Сгибание ног (Leg curl) (лучше сидя): 4 сета, 10-15 повт, RIR: 1 (первые два, потом до отказа), 2/0/1/0' },
    { type: 'list', text: 'Подъемы на носки (Calf raises) в тренажере: 3 сета, 15-30 повт, RIR: 2, 1/0/1/0' },
    { type: 'list', text: 'Подъемы ног в висе (прямые колени): 3 сета, 10-15 повт, RIR: 0, 2/1/1/0' },
    { type: 'p', text: '10 мин велотренажер - легкое кардио 2 зоны' },
    { type: 'p', text: '' },
    { type: 'h1', text: 'День 7 – Отдых (Rest)' },
    { type: 'p', text: '' },
    { type: 'p', text: '+ Начинаем с кардио 30 мин 3 раза в неделю, зона 2 - пульс до ~140 (эллипс, дорожка в гору, степпер). Выполнять натощак или ПОСЛЕ силовой - никогда перед. После дня ног только 10 мин кардио.' },
    { type: 'p', text: 'Шаги: 10-12 тыс. в день. В конце недели должно быть суммарно 70 тыс.' }
];

const supplementPlanRU = [
    { type: 'h1', text: 'Суплементация (БАДы)' },
    { type: 'p', text: '' },
    { type: 'h2', text: 'Утром (с едой)' },
    { type: 'list', text: 'Бетаин HCL (Betaina HCL) + пепсин: 1 таб' },
    { type: 'list', text: 'Омега-3: 3г (DHA + EPA)' },
    { type: 'list', text: 'NAC: 600 мг' },
    { type: 'list', text: 'Вит C: 1000 мг' },
    { type: 'list', text: 'Бергамот (Citrus bergamot): 500 мг' },
    { type: 'list', text: 'Наттокиназа (Nattokinase): 2000 FU' },
    { type: 'list', text: 'Метилированный B-комплекс (Methyl B complex)' },
    { type: 'list', text: 'Бутират натрия (Maślan sodu): 650-800 мг' },
    { type: 'list', text: 'Вит D: 8 000 МЕ + K2 MK7' },
    { type: 'list', text: 'Креатин: 7г' },
    { type: 'p', text: '' },
    { type: 'h2', text: 'Перед тренировкой (если пьешь предтрен - пропусти)' },
    { type: 'list', text: 'Цитруллин: 8-10 г' },
    { type: 'list', text: 'Тадалафил/Силденафил: 15 мг' },
    { type: 'list', text: 'Кофеин: 200 мг (если тренировка после 16:00 - пропусти)' },
    { type: 'list', text: 'GW-501516: 10 мг + L-карнитин (400мг инъекционно или 2г L-tartrate)' },
    { type: 'list', text: 'Родиола розовая (Rhodiola rosea) 500мг (3% розавинов) + Alpha GPC 300мг – перед тяжелыми ногами' },
    { type: 'p', text: '' },
    { type: 'h2', text: 'Во время тренировки (Intra)' },
    { type: 'list', text: 'Декстроза 20г + EAA 20г + Электролиты (натрий, калий, магний, хлор, кальций – без вит C!)' },
    { type: 'p', text: '' },
    { type: 'h2', text: 'После тренировки' },
    { type: 'list', text: 'Глицинат магния: 5г' },
    { type: 'list', text: 'Декстроза + EAA + Электролиты – 1/3 часть, оставшаяся после тренировки.' },
    { type: 'list', text: 'Креатин: 7г' },
    { type: 'p', text: '' },
    { type: 'h2', text: 'Вечером' },
    { type: 'list', text: 'Мелатонин: 5 мг' },
    { type: 'list', text: 'Омега-3: 3г (DHA + EPA)' },
    { type: 'list', text: 'Бутират натрия (Maślan sodu): 650-800 мг' },
    { type: 'list', text: 'Хелат цинка: 30 мг' },
    { type: 'p', text: 'Если тренировка была поздно или есть проблемы со сном – адаптогены (L-теанин 400мг, кава-кава, ашваганда 500-700мг 5% – циклично, GABA 1000мг)' }
];

async function createDoc(content, fileName) {
    const children = [];

    for (const item of content) {
        if (item.type === 'h1') {
            children.push(new Paragraph({
                text: item.text,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 120, before: 240 }
            }));
        } else if (item.type === 'h2') {
            children.push(new Paragraph({
                text: item.text,
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 120, before: 240 }
            }));
        } else if (item.type === 'list') {
            children.push(new Paragraph({
                text: item.text,
                bullet: { level: 0 },
                spacing: { after: 50 }
            }));
        } else if (item.type === 'p') {
            children.push(new Paragraph({
                text: item.text,
                spacing: { after: 120 }
            }));
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    const fullPath = path.join(outputDir, fileName);
    fs.writeFileSync(fullPath, buffer);
    console.log(`✅ Создан файл: ${fullPath}`);
}

async function main() {
    await createDoc(trainingPlanRU, "Plan Treningowy Artem_RU.docx");
    await createDoc(supplementPlanRU, "Suplementacja Artem_RU.docx");
}

main().catch(console.error);
