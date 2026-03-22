import win32com.client
import os
import json

def analyze_spreadsheet(file_path):
    excel = win32com.client.Dispatch('Excel.Application')
    excel.Visible = False
    wb = excel.Workbooks.Open(os.path.abspath(file_path))
    
    analysis = {}
    
    # We will get cell boundaries up to 150 rows and 15 columns
    for sheet in wb.Sheets:
        ws = sheet
        sheet_data = []
        for row in range(1, 150):
            row_data = {}
            has_data = False
            for col in range(1, 15):
                val = ws.Cells(row, col).Value
                # Also capture formula to see if they are calculated
                formula = ws.Cells(row, col).Formula
                if val is not None:
                    addr = ws.Cells(row, col).Address
                    # Use str() robustly, ignore emojis explicitly if needed, but json.dumps handles unicode perfectly
                    row_data[addr] = {
                        "value": val,
                        "formula": formula if str(formula).startswith("=") else None
                    }
                    has_data = True
            if has_data:
                sheet_data.append({"row": row, "cells": row_data})
        analysis[sheet.Name] = sheet_data

    wb.Close(False)
    excel.Quit()
    
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "spreadsheet_dump.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    analyze_spreadsheet(r"C:\Users\stani\OneDrive\Pulpit\Plany\Artem\Dieta_Artem_v2.xlsx")
