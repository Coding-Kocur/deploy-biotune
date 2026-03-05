import fitz
import sys
import os

files = [
    r"C:\Users\stani\OneDrive\Pulpit\BioTune\Etykieta\Retatrutide 10 38x18.pdf",
    r"C:\Users\stani\OneDrive\Pulpit\BioTune\Etykieta\BPC157 + TB-500 10 38x18.pdf"
]

for f in files:
    print(f"\n--- Checking {os.path.basename(f)} ---")
    doc = fitz.open(f)
    page = doc[0]
    
    rect = page.rect
    w_mm = rect.width * 25.4 / 72
    h_mm = rect.height * 25.4 / 72
    print(f"Page rect in pts: {rect}")
    print(f"Dimensions: {w_mm:.2f} x {h_mm:.2f} mm")
    
    images = doc.get_page_images(0)
    for index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        w = base_image["width"]
        h = base_image["height"]
        print(f"Image {index} (xref {xref}): {w} x {h} px")
        print(f"  DPI if mm size is kept: w={(w / w_mm * 25.4):.1f} dpi, h={(h / h_mm * 25.4):.1f} dpi")
        
    doc.close()
