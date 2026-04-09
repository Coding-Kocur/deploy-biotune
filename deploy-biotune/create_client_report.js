const ExcelJS = require('exceljs');

const filePathPL = 'C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Raport_Tygodniowy_Klient.xlsx';
const filePathRU = 'C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Raport_Tygodniowy_Klient_RU.xlsx';

// Extreme values that should trigger warning (PL)
const extremeValuesPL = [
    'Brak', 'Bardzo zla', 'Zla', 'Bardzo niska', 'Niska', 'Slaba', 'Slaby',
    'Silne', 'Silny', 'Bardzo czeste', 'Czeste', 'Wolna', 'Spadek',
    'Zaczerwienienie', 'Bol', 'Obrzek', 'Wysoki', 'Bardzo wysoki', 'Zly',
    '<80%', '<6h', '<3L', '0x dziennie'
];

// Extreme values that should trigger warning (RU)
const extremeValuesRU = [
    'Нет', 'Очень плохое', 'Плохое', 'Очень низкая', 'Низкая', 'Слабый', 'Слабая',
    'Сильная', 'Сильный', 'Сильное', 'Очень часто', 'Часто', 'Медленное', 'Снижение',
    'Покраснение', 'Боль', 'Отек', 'Высокий', 'Очень высокий', 'Плохое',
    '<80%', '<6ч', '<3л', '0 раз/день'
];

// ============================================
// HELPER: Create sheet content for PL
// ============================================
function createSheetContentPL(ws) {
    ws.columns = [
        { width: 45 }, { width: 25 }, { width: 40 }, { width: 30 }
    ];

    let row = 1;
    const dropdownCells = []; // Track cells with dropdowns for conditional formatting

    function addHeader(text) {
        ws.mergeCells(`A${row}:D${row}`);
        ws.getCell(`A${row}`).value = text;
        ws.getCell(`A${row}`).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF37474F' } };
        ws.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(row).height = 25;
        row++;
    }

    function addSubHeader(text) {
        ws.mergeCells(`A${row}:D${row}`);
        ws.getCell(`A${row}`).value = text;
        ws.getCell(`A${row}`).font = { bold: true, size: 11 };
        ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB0BEC5' } };
        row++;
    }

    function addQuestion(question, options, hasComment = false) {
        ws.getCell(`A${row}`).value = question;
        ws.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'middle' };
        const optionsWithSkip = ['Pomin', ...options];
        ws.getCell(`B${row}`).dataValidation = {
            type: 'list', allowBlank: true, formulae: [`"${optionsWithSkip.join(',')}"`]
        };
        // Color only dropdown cells
        ws.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } };
        dropdownCells.push({ row, options: optionsWithSkip });

        if (hasComment) {
            ws.getCell(`C${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
            ws.getCell(`C${row}`).alignment = { wrapText: true };
        }
        row++;
    }

    function addInputField(label, hasComment = false, hasAttachment = false) {
        ws.getCell(`A${row}`).value = label;
        ws.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'middle' };
        // NO fill for input fields - only border
        if (hasComment) {
            ws.getCell(`C${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
        }
        if (hasAttachment) {
            ws.getCell(`D${row}`).value = '[Wstaw plik/zdjecie]';
            ws.getCell(`D${row}`).font = { italic: true, color: { argb: 'FF9E9E9E' } };
        }
        row++;
    }

    function addPhotoField(poseName) {
        ws.getCell(`A${row}`).value = poseName;
        ws.getCell(`B${row}`).value = '[Wstaw zdjecie]';
        ws.getCell(`B${row}`).font = { italic: true, color: { argb: 'FF9E9E9E' } };
        ws.getCell(`C${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
        row++;
    }

    function addSpacer() { row++; }

    // Column headers
    ws.getCell('A1').value = 'Pytanie';
    ws.getCell('B1').value = 'Odpowiedz';
    ws.getCell('C1').value = 'Komentarz';
    ws.getCell('D1').value = 'Zalacznik';
    ['A1', 'B1', 'C1', 'D1'].forEach(c => {
        ws.getCell(c).font = { bold: true };
        ws.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCFD8DC' } };
    });
    row = 2;

    addSpacer();
    addInputField('Data wypelnienia raportu (DD.MM.RRRR)');
    addSpacer();

    addHeader('BADANIA');
    addInputField('Cukier na czczo (mg/dL)');
    addInputField('Cisnienie rano (np. 120/80)');
    addInputField('Cisnienie wieczorem (np. 120/80)');
    addInputField('Srednie HR (bpm)');
    addInputField('Tetno spoczynkowe rano przed wstaniem (bpm)');
    addInputField('Temperatura ciala rano (C)');
    addQuestion('Palpitacje serca', ['Brak', 'Sporadyczne', 'Czeste', 'Bardzo czeste'], true);
    addInputField('Zalacznik: skany/zdjecia badan krwi', false, true);
    addSpacer();

    addHeader('SAMOPOCZUCIE');
    addQuestion('Apetyt', ['Brak', 'Slaby', 'Normalny', 'Zwiekszony'], true);
    addQuestion('Jakosc snu', ['Bardzo zla', 'Zla', 'Dobra', 'Bardzo dobra'], true);
    addQuestion('Czas snu', ['<6h', '6-7h', '7-8h', '8h+']);
    addQuestion('Zakwasy / DOMS', ['Brak', 'Lekkie', 'Umiarkowane', 'Silne'], true);
    addQuestion('Libido', ['Brak', 'Niskie', 'Normalne', 'Wysokie']);
    addQuestion('Erekcja', ['Slaba', 'Przecietna', 'Dobra', 'Bardzo dobra']);
    addQuestion('Energia w ciagu dnia', ['Bardzo niska', 'Niska', 'Normalna', 'Wysoka']);
    addQuestion('Zmeczenie po treningu', ['Brak', 'Lekkie', 'Umiarkowane', 'Silne']);
    addSpacer();

    addHeader('TRAWIENIE');
    addQuestion('Czestotliwosc wyprozien', ['0x dziennie', '1x dziennie', '2x dziennie', '3x+ dziennie']);
    addQuestion('Wzdecia / zatrzymywanie wody', ['Brak', 'Lekkie', 'Umiarkowane', 'Silne'], true);
    addSpacer();

    addHeader('TRENING');
    addQuestion('Jakosc pompy na treningu', ['Slaba', 'Przecietna', 'Dobra', 'Znakomita']);
    addQuestion('Regeneracja miedzy seriami', ['Wolna', 'Normalna', 'Szybka']);
    addQuestion('Bol stawow / dyskomfort', ['Brak', 'Lekki', 'Umiarkowany', 'Silny'], true);
    addSpacer();
    addSubHeader('Sila na glownych liftach wielostawowych');
    addQuestion('Zmiana sily', ['Spadek', 'Bez zmian', 'Poprawa'], true);
    addInputField('Jesli zmiany - na czym i o ile kg?', true);
    addSpacer();

    addHeader('SAA / INIEKCJE');
    addQuestion('Reakcje w miejscu iniekcji', ['Brak', 'Zaczerwienienie', 'Bol', 'Obrzek'], true);
    addQuestion('Tradzik', ['Brak', 'Lekki', 'Umiarkowany', 'Silny'], true);
    addQuestion('Wypadanie wlosow', ['Brak', 'Lekkie', 'Umiarkowane', 'Silne'], true);
    addSpacer();

    addHeader('PSYCHIKA');
    addQuestion('Poziom stresu', ['Niski', 'Umiarkowany', 'Wysoki', 'Bardzo wysoki'], true);
    addQuestion('Nastroj ogolny', ['Zly', 'Przecietny', 'Dobry', 'Bardzo dobry']);
    addSpacer();

    addHeader('POMIARY');
    addInputField('Waga - srednia z tygodnia (kg)');
    addInputField('Obwod talii na wysokosci pepka - srednia vacuum/relaxed (cm)');
    addInputField('Obwod klatki piersiowej (cm)');
    addInputField('Obwod uda - srednia prawe/lewe (cm)');
    addInputField('Obwod bicepsa - srednia prawy/lewy (cm)');
    addSpacer();

    addHeader('ZDJECIA (stale swiatlo, stala lokalizacja)');
    addPhotoField('Front Lat Spread');
    addPhotoField('Front Double Biceps');
    addPhotoField('Side Chest');
    addPhotoField('Back Double Biceps (widoczny posladek)');
    addPhotoField('Abs and Thighs');
    addSpacer();

    addHeader('OCENA REALIZACJI');
    addQuestion('Realizacja planu treningowego', ['<80%', '80-90%', '90-100%', '100%'], true);
    addQuestion('Realizacja planu dietetycznego', ['<80%', '80-90%', '90-100%', '100%'], true);
    addQuestion('Nawodnienie', ['<3L', '3-4L', '4-5L', '5L+']);
    addQuestion('Realizacja suplementacji', ['<80%', '80-90%', '90-100%', '100%'], true);
    addSpacer();

    addHeader('UWAGI, PYTANIA, PROPOZYCJE');
    ws.mergeCells(`A${row}:D${row + 4}`);
    ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
    ws.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'top' };
    ws.getRow(row).height = 100;

    // Add borders
    for (let r = 1; r <= row + 4; r++) {
        for (let c = 1; c <= 4; c++) {
            ws.getCell(r, c).border = {
                top: { style: 'thin', color: { argb: 'FFB0BEC5' } },
                left: { style: 'thin', color: { argb: 'FFB0BEC5' } },
                bottom: { style: 'thin', color: { argb: 'FFB0BEC5' } },
                right: { style: 'thin', color: { argb: 'FFB0BEC5' } }
            };
        }
    }

    // Add conditional formatting for extreme values (warning icon)
    dropdownCells.forEach(({ row: r, options }) => {
        const extremeOpts = options.filter(o => extremeValuesPL.includes(o));
        if (extremeOpts.length > 0) {
            extremeOpts.forEach(extremeVal => {
                ws.addConditionalFormatting({
                    ref: `B${r}`,
                    rules: [{
                        type: 'containsText',
                        operator: 'containsText',
                        text: extremeVal,
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFEB3B' } },
                            font: { color: { argb: 'FFD32F2F' }, bold: true }
                        }
                    }]
                });
            });
        }
    });
}

// ============================================
// HELPER: Create sheet content for RU
// ============================================
function createSheetContentRU(ws) {
    ws.columns = [
        { width: 50 }, { width: 25 }, { width: 40 }, { width: 30 }
    ];

    let row = 1;
    const dropdownCells = [];

    function addHeader(text) {
        ws.mergeCells(`A${row}:D${row}`);
        ws.getCell(`A${row}`).value = text;
        ws.getCell(`A${row}`).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF37474F' } };
        ws.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' };
        ws.getRow(row).height = 25;
        row++;
    }

    function addSubHeader(text) {
        ws.mergeCells(`A${row}:D${row}`);
        ws.getCell(`A${row}`).value = text;
        ws.getCell(`A${row}`).font = { bold: true, size: 11 };
        ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB0BEC5' } };
        row++;
    }

    function addQuestion(question, options, hasComment = false) {
        ws.getCell(`A${row}`).value = question;
        ws.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'middle' };
        const optionsWithSkip = ['Пропустить', ...options];
        ws.getCell(`B${row}`).dataValidation = {
            type: 'list', allowBlank: true, formulae: [`"${optionsWithSkip.join(',')}"`]
        };
        ws.getCell(`B${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } };
        dropdownCells.push({ row, options: optionsWithSkip });

        if (hasComment) {
            ws.getCell(`C${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
            ws.getCell(`C${row}`).alignment = { wrapText: true };
        }
        row++;
    }

    function addInputField(label, hasComment = false, hasAttachment = false) {
        ws.getCell(`A${row}`).value = label;
        ws.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'middle' };
        if (hasComment) {
            ws.getCell(`C${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
        }
        if (hasAttachment) {
            ws.getCell(`D${row}`).value = '[Прикрепить файл/фото]';
            ws.getCell(`D${row}`).font = { italic: true, color: { argb: 'FF9E9E9E' } };
        }
        row++;
    }

    function addPhotoField(poseName) {
        ws.getCell(`A${row}`).value = poseName;
        ws.getCell(`B${row}`).value = '[Прикрепить фото]';
        ws.getCell(`B${row}`).font = { italic: true, color: { argb: 'FF9E9E9E' } };
        ws.getCell(`C${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
        row++;
    }

    function addSpacer() { row++; }

    ws.getCell('A1').value = 'Вопрос';
    ws.getCell('B1').value = 'Ответ';
    ws.getCell('C1').value = 'Комментарий';
    ws.getCell('D1').value = 'Вложение';
    ['A1', 'B1', 'C1', 'D1'].forEach(c => {
        ws.getCell(c).font = { bold: true };
        ws.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCFD8DC' } };
    });
    row = 2;

    addSpacer();
    addInputField('Дата заполнения отчета (ДД.ММ.ГГГГ)');
    addSpacer();

    addHeader('АНАЛИЗЫ');
    addInputField('Сахар натощак (мг/дл)');
    addInputField('Давление утром (напр. 120/80)');
    addInputField('Давление вечером (напр. 120/80)');
    addInputField('Средний пульс (уд/мин)');
    addInputField('Пульс в покое утром до подъема (уд/мин)');
    addInputField('Температура тела утром (C)');
    addQuestion('Сердцебиение (пальпитации)', ['Нет', 'Редко', 'Часто', 'Очень часто'], true);
    addInputField('Вложение: сканы/фото анализов крови', false, true);
    addSpacer();

    addHeader('САМОЧУВСТВИЕ');
    addQuestion('Аппетит', ['Нет', 'Слабый', 'Нормальный', 'Повышенный'], true);
    addQuestion('Качество сна', ['Очень плохое', 'Плохое', 'Хорошее', 'Очень хорошее'], true);
    addQuestion('Продолжительность сна', ['<6ч', '6-7ч', '7-8ч', '8ч+']);
    addQuestion('Крепатура / DOMS', ['Нет', 'Легкая', 'Умеренная', 'Сильная'], true);
    addQuestion('Либидо', ['Нет', 'Низкое', 'Нормальное', 'Высокое']);
    addQuestion('Эрекция', ['Слабая', 'Средняя', 'Хорошая', 'Очень хорошая']);
    addQuestion('Энергия в течение дня', ['Очень низкая', 'Низкая', 'Нормальная', 'Высокая']);
    addQuestion('Усталость после тренировки', ['Нет', 'Легкая', 'Умеренная', 'Сильная']);
    addSpacer();

    addHeader('ПИЩЕВАРЕНИЕ');
    addQuestion('Частота стула', ['0 раз/день', '1 раз/день', '2 раза/день', '3+ раза/день']);
    addQuestion('Вздутие / задержка воды', ['Нет', 'Легкое', 'Умеренное', 'Сильное'], true);
    addSpacer();

    addHeader('ТРЕНИРОВКИ');
    addQuestion('Качество пампа на тренировке', ['Слабый', 'Средний', 'Хороший', 'Отличный']);
    addQuestion('Восстановление между подходами', ['Медленное', 'Нормальное', 'Быстрое']);
    addQuestion('Боль в суставах / дискомфорт', ['Нет', 'Легкий', 'Умеренный', 'Сильный'], true);
    addSpacer();
    addSubHeader('Сила в основных многосуставных упражнениях');
    addQuestion('Изменение силы', ['Снижение', 'Без изменений', 'Рост'], true);
    addInputField('Если изменения - в каком упражнении и на сколько кг?', true);
    addSpacer();

    addHeader('САА / ИНЪЕКЦИИ');
    addQuestion('Реакция в месте инъекции', ['Нет', 'Покраснение', 'Боль', 'Отек'], true);
    addQuestion('Акне', ['Нет', 'Легкое', 'Умеренное', 'Сильное'], true);
    addQuestion('Выпадение волос', ['Нет', 'Легкое', 'Умеренное', 'Сильное'], true);
    addSpacer();

    addHeader('ПСИХИКА');
    addQuestion('Уровень стресса', ['Низкий', 'Умеренный', 'Высокий', 'Очень высокий'], true);
    addQuestion('Общее настроение', ['Плохое', 'Среднее', 'Хорошее', 'Очень хорошее']);
    addSpacer();

    addHeader('ЗАМЕРЫ');
    addInputField('Вес - среднее за неделю (кг)');
    addInputField('Обхват талии на уровне пупка - среднее vacuum/relaxed (см)');
    addInputField('Обхват груди (см)');
    addInputField('Обхват бедра - среднее правое/левое (см)');
    addInputField('Обхват бицепса - среднее правый/левый (см)');
    addSpacer();

    addHeader('ФОТО (постоянное освещение, постоянная локация)');
    addPhotoField('Front Lat Spread');
    addPhotoField('Front Double Biceps');
    addPhotoField('Side Chest');
    addPhotoField('Back Double Biceps (видна ягодица)');
    addPhotoField('Abs and Thighs');
    addSpacer();

    addHeader('ОЦЕНКА ВЫПОЛНЕНИЯ');
    addQuestion('Выполнение тренировочного плана', ['<80%', '80-90%', '90-100%', '100%'], true);
    addQuestion('Выполнение плана питания', ['<80%', '80-90%', '90-100%', '100%'], true);
    addQuestion('Гидратация', ['<3л', '3-4л', '4-5л', '5л+']);
    addQuestion('Выполнение плана добавок', ['<80%', '80-90%', '90-100%', '100%'], true);
    addSpacer();

    addHeader('ЗАМЕЧАНИЯ, ВОПРОСЫ, ПРЕДЛОЖЕНИЯ');
    ws.mergeCells(`A${row}:D${row + 4}`);
    ws.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
    ws.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'top' };
    ws.getRow(row).height = 100;

    for (let r = 1; r <= row + 4; r++) {
        for (let c = 1; c <= 4; c++) {
            ws.getCell(r, c).border = {
                top: { style: 'thin', color: { argb: 'FFB0BEC5' } },
                left: { style: 'thin', color: { argb: 'FFB0BEC5' } },
                bottom: { style: 'thin', color: { argb: 'FFB0BEC5' } },
                right: { style: 'thin', color: { argb: 'FFB0BEC5' } }
            };
        }
    }

    // Add conditional formatting for extreme values
    dropdownCells.forEach(({ row: r, options }) => {
        const extremeOpts = options.filter(o => extremeValuesRU.includes(o));
        if (extremeOpts.length > 0) {
            extremeOpts.forEach(extremeVal => {
                ws.addConditionalFormatting({
                    ref: `B${r}`,
                    rules: [{
                        type: 'containsText',
                        operator: 'containsText',
                        text: extremeVal,
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFEB3B' } },
                            font: { color: { argb: 'FFD32F2F' }, bold: true }
                        }
                    }]
                });
            });
        }
    });
}

// ============================================
// MAIN
// ============================================
async function createReports() {
    const wbPL = new ExcelJS.Workbook();
    for (let i = 1; i <= 25; i++) {
        const ws = wbPL.addWorksheet(`Tydzien ${i}`);
        createSheetContentPL(ws);
    }
    await wbPL.xlsx.writeFile(filePathPL);
    console.log('Raport PL utworzony (25 arkuszy):', filePathPL);

    const wbRU = new ExcelJS.Workbook();
    for (let i = 1; i <= 25; i++) {
        const ws = wbRU.addWorksheet(`Неделя ${i}`);
        createSheetContentRU(ws);
    }
    await wbRU.xlsx.writeFile(filePathRU);
    console.log('Отчет RU создан (25 листов):', filePathRU);
}

createReports().catch(console.error);
