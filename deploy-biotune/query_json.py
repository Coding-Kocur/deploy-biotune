import json
import os

out_lines = []
with open(os.path.join(os.path.dirname(__file__), "spreadsheet_dump.json"), "r", encoding="utf-8") as f:
    data = json.load(f)

keywords = ["posi", "płatki owsiane", "borówki", "banan", "ryż", "masło orzechowe", "oliwa"]

for sheet_name, sheet_data in data.items():
    out_lines.append(f"--- {sheet_name.upper()} ---")
    
    for row_info in sheet_data:
        row = row_info["row"]
        cells = row_info["cells"]
        
        for addr, cell_info in cells.items():
            val = str(cell_info["value"]).lower()
            if any(k in val for k in keywords):
                context = []
                for col in ["A", "B", "C", "D", "E", "F", "G", "H", "I"]:
                    col_addr = f"${col}${row}"
                    if col_addr in cells:
                        c_val = cells[col_addr]["value"]
                        c_form = cells[col_addr]["formula"]
                        has_form = f"({c_form})" if c_form else ""
                        context.append(f"{col}={c_val}{has_form}")
                out_lines.append(f"Row {row}: {', '.join(context)}")

with open(os.path.join(os.path.dirname(__file__), "query_results.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

