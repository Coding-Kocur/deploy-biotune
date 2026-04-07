import win32com.client
import os

file_path = r"C:\Users\stani\OneDrive\Pulpit\Plany\Artem\Dieta_Artem_v2.xlsx"

excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False
wb = excel.Workbooks.Open(os.path.abspath(file_path))

def update_row_macros(ws, row, new_weight, old_weight, name_changes=None):
    factor = new_weight / old_weight
    ws.Cells(row, 2).Value = new_weight
    # Columns C, D, E, F, G, H, I
    for c in range(3, 10):
        old_val = ws.Cells(row, c).Value
        if old_val is not None and isinstance(old_val, (int, float)):
            # rounded to 1 decimal place usually for macros, 0 for kcal? 
            # Let's use 1 decimal place for C-F, I, and 0 for G, H
            new_val = old_val * factor
            if c in [7, 8]: # G, H (Kcal, Sodium maybe?)
                ws.Cells(row, c).Value = round(new_val, 0)
            else:
                ws.Cells(row, c).Value = round(new_val, 1)
    
    if name_changes:
        # e.g. name_changes = {'PL': "Borówki mrożone", 'RU': "Черника замороженная"}
        # formula looks like =IF($K$1="PL", "Borówki mrożone", "Черника замороженная")
        ws.Cells(row, 1).Formula = f'=IF($K$1="PL", "{name_changes["PL"]}", "{name_changes["RU"]}")'

try:
    # --- TRENINGOWY ---
    ws = wb.Sheets("dzień treningowy")
    
    # 1. Posiłek 1
    # Płatki owsiane: 50 -> 30 (Row 9)
    update_row_macros(ws, 9, 30.0, 50.0)
    # Borówki: 150 -> 100 (Row 10)
    update_row_macros(ws, 10, 100.0, 150.0)
    
    # 2. Posiłek 2 (Row 19 -> Kleik, Row 20 -> Banan)
    # Zamień banana na 100g borówek
    # old weight of banan is 120. But to get correct borówki macros, we shouldn't scale banan macros!
    # Borówki 150g macros from Row 10 originally: C=1.1, D=21.8, E=0.5, F=3.6, G=86, H=116, I=2.
    # 100g borówek = 2/3 of 150g = C:0.7, D:14.5, E:0.3, F:2.4, G:57, H:77, I:1.3.
    bor_macros = [100.0, 0.7, 14.5, 0.3, 2.4, 57.0, 77.0, 1.3]
    for i, c in enumerate(range(2, 10)):
        ws.Cells(20, c).Value = bor_macros[i]
    ws.Cells(20, 1).Formula = '=IF($K$1="PL", "Borówki mrożone", "Черника замороженная")'
    
    # 3. Inne posiłki z ryżem (3, 4, 6) - 50g -> 40g
    # Row 33
    update_row_macros(ws, 33, 40.0, 50.0)
    # Row 44
    update_row_macros(ws, 44, 40.0, 50.0)
    # Row 63
    update_row_macros(ws, 63, 40.0, 50.0)
    
    # 4. Move Posiłek 5 to after Posiłek 2
    # Posiłek 5 is rows 49-56 (inclusive, 8 rows).
    # We want to cut rows 49-56 and insert them at row 27.
    # To do this cleanly in COM:
    ws.Rows("49:56").Cut()
    ws.Rows("27:27").Insert(Shift=-4121) # xlDown = -4121
    
    # Now the previous Posiłek 5 is at 27-34.
    # Old Posiłek 3 is now at 35-44 (10 rows).
    # Old Posiłek 4 is now at 45-55.
    # Old Posiłek 6 is at 56-67.
    # Let's fix the numbering.
    # Row 27 was Posiłek 5. Now it should be Posiłek 3.
    ws.Cells(27, 1).Formula = '=IF($K$1="PL", "POSIŁEK 3 - Peri-Workout (Intra/Post) (Podczas/po treningu)", "ПРИЕМ ПИЩИ 3 - Изотоник (Во время/после тренировки)")'
    ws.Cells(33, 1).Formula = '=IF($K$1="PL", "SUMA POSIŁEK 3", "ИТОГО ПРИЕМ ПИЩИ 3")'
    
    # New row 35 was Posiłek 3. Now it should be 4.
    ws.Cells(35, 1).Formula = '=IF($K$1="PL", "POSIŁEK 4 - Obiad (~13:00)", "ПРИЕМ ПИЩИ 4 - Обед (~13:00)")'
    ws.Cells(44, 1).Formula = '=IF($K$1="PL", "SUMA POSIŁEK 4", "ИТОГО ПРИЕМ ПИЩИ 4")'
    
    # New row 46 was Posiłek 4. Now it should be 5.
    ws.Cells(46, 1).Formula = '=IF($K$1="PL", "POSIŁEK 5 - Kolacja 1 (~17:00)", "ПРИЕМ ПИЩИ 5 - Ужин 1 (~17:00)")'
    ws.Cells(55, 1).Formula = '=IF($K$1="PL", "SUMA POSIŁEK 5", "ИТОГО ПРИЕМ ПИЩИ 5")'
    
    # Let's verify new row 57, it was Posiłek 6. It's still Posiłek 6 at row 57.
    # We don't need to rename it, since it's correctly number 6.
    
    # Set Calories summary B72
    # The SUM rows are now at:
    # Pos 1: 15
    # Pos 2: 25
    # Pos 3 (Peri): 33
    # Pos 4 (Obiad): 44
    # Pos 5 (Kolacja 1): 55
    # Pos 6 (Kolacja 2): 67
    
    ws.Cells(72, 1).Value = "TOTAL KCAL:"
    ws.Cells(72, 1).Font.Bold = True
    ws.Cells(72, 2).Formula = '=SUM(G15, G25, G33, G44, G55, G67)'
    ws.Cells(72, 2).Font.Bold = True

    # --- NIETRENINGOWY ---
    ws_nt = wb.Sheets("dzień nietreningowy")
    
    # 1. Usuń masło orzechowe z ostatniego posiłku
    # Last meal is Posiłek 5 (Row 48-57). Masło is at Row 54.
    # Just clear the row, but better to delete it entirely so it shifts up, preventing empty gaps.
    ws_nt.Rows("54:54").Delete(Shift=-4162) # xlUp = -4162
    
    # 2. Zmień oliwę na 4g do posiłków z ryżem
    # Posiłek 2: Row 20
    update_row_macros(ws_nt, 20, 4.0, 7.0)
    # Posiłek 3: Row 31
    update_row_macros(ws_nt, 31, 4.0, 7.0)
    # Posiłek 4: Row 42
    update_row_macros(ws_nt, 42, 4.0, 7.0)
    
    # Set Calories summary B62
    # SUM rows: Pos 1: 13, Pos 2: 24, Pos 3: 35, Pos 4: 46, Pos 5: 56 (was 57 before row deletion)
    ws_nt.Cells(62, 1).Value = "TOTAL KCAL:"
    ws_nt.Cells(62, 1).Font.Bold = True
    ws_nt.Cells(62, 2).Formula = '=SUM(G13, G24, G35, G46, G56)'
    ws_nt.Cells(62, 2).Font.Bold = True

    wb.Save()

finally:
    wb.Close(False)
    excel.Quit()
    print("Done")
