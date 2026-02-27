const ExcelJS = require('exceljs');

// Artem's answers from his report (translated to Polish where needed)
const artemDataRU = {
    'Дата заполнения отчета (ДД.ММ.ГГГГ)': '30.01.2026',
    'Сердцебиение (пальпитации)': 'Часто',
    'Аппетит': 'Нормальный',
    'Качество сна': 'Очень хорошее',
    'Продолжительность сна': '7-8ч',
    'Крепатура / DOMS': 'Нет',
    'Либидо': 'Высокое',
    'Эрекция': 'Хорошая',
    'Энергия в течение дня': 'Нормальная',
    'Усталость после тренировки': 'Умеренная',
    'Частота стула': '1 раз/день',
    'Вздутие / задержка воды': 'Нет',
    'Качество пампа на тренировке': 'Отличный',
    'Восстановление между подходами': 'Нормальное',
    'Боль в суставах / дискомфорт': 'Нет',
    'Изменение силы': 'Рост',
    'Если изменения - в каком упражнении и на сколько кг?': 'жим в наклонной на 30 кг',
    'Реакция в месте инъекции': 'Нет',
    'Акне': 'Умеренное',
    'Выпадение волос': 'Нет',
    'Уровень стресса': 'Низкий',
    'Общее настроение': 'Среднее',
    'Вес - среднее за неделю (кг)': '91 кг',
    'Обхват талии на уровне пупка - среднее vacuum/relaxed (см)': '82 см',
    'Обхват груди (см)': '110 см',
    'Обхват бедра - среднее правое/левое (см)': '64 см',
    'Обхват бицепса - среднее правый/левый (см)': '63 см',
    'Выполнение тренировочного плана': '90-100%',
    'Выполнение плана питания': '90-100%',
    'Гидратация': '3-4л',
    'Выполнение плана добавок': '100%'
};

// Polish translation of Artem's answers
const artemDataPL = {
    'Data wypelnienia raportu (DD.MM.RRRR)': '30.01.2026',
    'Palpitacje serca': 'Czeste',
    'Apetyt': 'Normalny',
    'Jakosc snu': 'Bardzo dobra',
    'Czas snu': '7-8h',
    'Zakwasy / DOMS': 'Brak',
    'Libido': 'Wysokie',
    'Erekcja': 'Dobra',
    'Energia w ciagu dnia': 'Normalna',
    'Zmeczenie po treningu': 'Umiarkowane',
    'Czestotliwosc wyprozien': '1x dziennie',
    'Wzdecia / zatrzymywanie wody': 'Brak',
    'Jakosc pompy na treningu': 'Znakomita',
    'Regeneracja miedzy seriami': 'Normalna',
    'Bol stawow / dyskomfort': 'Brak',
    'Zmiana sily': 'Poprawa',
    'Jesli zmiany - na czym i o ile kg?': 'wyciskanie skos +30 kg',
    'Reakcje w miejscu iniekcji': 'Brak',
    'Tradzik': 'Umiarkowany',
    'Wypadanie wlosow': 'Brak',
    'Poziom stresu': 'Niski',
    'Nastroj ogolny': 'Przecietny',
    'Waga - srednia z tygodnia (kg)': '91 kg',
    'Obwod talii na wysokosci pepka - srednia vacuum/relaxed (cm)': '82 cm',
    'Obwod klatki piersiowej (cm)': '110 cm',
    'Obwod uda - srednia prawe/lewe (cm)': '64 cm',
    'Obwod bicepsa - srednia prawy/lewy (cm)': '63 cm',
    'Realizacja planu treningowego': '90-100%',
    'Realizacja planu dietetycznego': '90-100%',
    'Nawodnienie': '3-4L',
    'Realizacja suplementacji': '100%'
};

// Comments section
const uwagi = 'акцент больше на плечи (więcej akcentu na barki)';

async function updateFile(filePath, sheetName, data, uwagi) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    
    const ws = wb.getWorksheet(sheetName);
    if (!ws) {
        console.log(`Sheet "${sheetName}" not found in ${filePath}`);
        return;
    }

    // Find and update cells based on question text in column A
    for (let r = 1; r <= 80; r++) {
        const questionCell = ws.getCell(r, 1);
        const question = questionCell.value?.toString() || '';
        
        if (data[question]) {
            ws.getCell(r, 2).value = data[question];
            console.log(`Updated row ${r}: ${question} = ${data[question]}`);
        }
    }

    // Find UWAGI section and add comments
    for (let r = 1; r <= 80; r++) {
        const val = ws.getCell(r, 1).value?.toString() || '';
        if (val.includes('ЗАМЕЧАНИЯ') || val.includes('UWAGI')) {
            // The merged cell for comments is typically at row+1
            ws.getCell(r + 1, 1).value = uwagi;
            console.log(`Added comments at row ${r + 1}`);
            break;
        }
    }

    await wb.xlsx.writeFile(filePath);
    console.log(`Updated: ${filePath}`);
}

async function main() {
    // Update Russian version - Artem's data (Неделя 1)
    await updateFile(
        'C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Raport_Tygodniowy_Klient_RU.xlsx',
        'Неделя 1',
        artemDataRU,
        'акцент больше на плечи'
    );

    // Update Polish version - translated data (Tydzień 1)
    await updateFile(
        'C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Raport_Tygodniowy_Klient.xlsx',
        'Tydzien 1',
        artemDataPL,
        'więcej akcentu na barki'
    );
}

main().catch(console.error);
