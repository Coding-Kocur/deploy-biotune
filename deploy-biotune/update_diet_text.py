import win32com.client
import os

file_path = r"C:\Users\stani\OneDrive\Pulpit\Plany\Artem\Dieta_Artem_v2.xlsx"

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(os.path.abspath(file_path))

try:
    for sheet_name in ["dzień treningowy", "dzień nietreningowy"]:
        ws = wb.Sheets(sheet_name)
        
        # 1. Look for 'SUMA DZIENNA' to find the row with the totals
        suma_row = -1
        for r in range(50, 150):
            val = ws.Cells(r, 1).Value
            if val and "SUMA" in str(val).upper() and "DZIENNA" in str(val).upper():
                suma_row = r
                break
                
        if suma_row != -1:
            # Get the macros
            # Column C: Białko
            # Column D: Węglowodany
            # Column E: Tłuszcze
            bialko_g = ws.Cells(suma_row, 3).Value
            weglow_g = ws.Cells(suma_row, 4).Value
            tluszcze_g = ws.Cells(suma_row, 5).Value
            
            # Calculate kcal
            bialko_kcal = int(round(float(bialko_g) * 4))
            weglow_kcal = int(round(float(weglow_g) * 4))
            tluszcz_kcal = int(round(float(tluszcze_g) * 9))
            
            # 2. Look for the 'Kalorie z makroskładników' text to replace it
            text_row = -1
            for r in range(suma_row, suma_row + 20):
                val = ws.Cells(r, 1).Value
                # Try to find the line that starts with graph emoji or contains 'Kalorie'
                # Let's also check formulas
                formula = ws.Cells(r, 1).Formula
                if "Kalorie z makroskładników" in str(formula) or "Kalorie z makroskładników" in str(val):
                    text_row = r
                    break
            
            if text_row != -1:
                # Build the formula
                # Important: use commas inside the IF statement in VBA (.Formula property uses English commas)
                formula_str = (f'=IF($K$1="PL", '
                               f'"📈 Kalorie z makro: Białko {bialko_kcal} kcal | Węglowodany {weglow_kcal} kcal | Tłuszcze {tluszcz_kcal} kcal", '
                               f'"📈 Калории из макронутриентов: Белок {bialko_kcal} ккал | Углеводы {weglow_kcal} ккал | Жиры {tluszcz_kcal} ккал")')
                # Wait, user example: "📈 Kalorie z makroskładników: Białko 1052 kcal | Węglowodany 1053 kcal | Tłuszcze 654 kcal"
                formula_str = (f'=IF($K$1="PL", '
                               f'"📈 Kalorie z makroskładników: Białko {bialko_kcal} kcal | Węglowodany {weglow_kcal} kcal | Tłuszcze {tluszcz_kcal} kcal", '
                               f'"📈 Калории из макронутриентов: Белок {bialko_kcal} ккал | Углеводы {weglow_kcal} ккал | Жиры {tluszcz_kcal} ккал")')
                
                ws.Cells(text_row, 1).Formula = formula_str
                print(f"{sheet_name}: Updated row {text_row} with values B:{bialko_kcal} W:{weglow_kcal} T:{tluszcz_kcal}")
            else:
                print(f"{sheet_name}: Could not find the text row to replace.")
        else:
            print(f"{sheet_name}: Could not find SUMA DZIENNA row.")

    wb.Save()

finally:
    wb.Close(False)
    excel.Quit()
    print("Done")
