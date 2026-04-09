import win32com.client
import os

def analyze_spreadsheet(file_path):
    excel = win32com.client.Dispatch('Excel.Application')
    excel.Visible = False
    wb = excel.Workbooks.Open(os.path.abspath(file_path))
    
    analysis = {}
    for sheet in wb.Sheets:
        ws = sheet
        sheet_data = []
        # Let's scan a reasonable range like A1 to G100
        for row in range(1, 150):
            row_data = []
            for col in range(1, 10):
                val = ws.Cells(row, col).Value
                if val:
                    # just save the cell address and value
                    address = ws.Cells(row, col).Address
                    row_data.append((address, str(val)))
            if row_data:
                sheet_data.append(row_data)
        analysis[sheet.Name] = sheet_data

    wb.Close(False)
    excel.Quit()
    
    # Print out lines that contain interesting keywords
    keywords = ["posiłek", "płatki owsiane", "borówki", "banan", "periworkout", "masło orzechowe", "oliwa", "ryż"]
    for sheet_name, data in analysis.items():
        print(f"--- Sheet: {sheet_name} ---")
        for row in data:
            for addr, val in row:
                if any(kw.lower() in val.lower() for kw in keywords):
                    print(f"{addr}: {val}")
                # also print meal titles if they look like numbers or preworkout/postworkout
                if "workout" in val.lower() or "trening" in val.lower():
                     print(f"{addr}: {val}")

if __name__ == "__main__":
    analyze_spreadsheet(r"C:\Users\stani\OneDrive\Pulpit\Plany\Artem\Dieta_Artem_v2.xlsx")
