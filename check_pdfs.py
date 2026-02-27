import fitz
import sys
import os

files = [
    r"C:\Users\stani\OneDrive\Pulpit\BioTune\Etykieta\Retatrutide 10 38x18.pdf",
    r"C:\Users\stani\OneDrive\Pulpit\BioTune\Etykieta\BPC157 + TB-500 10 38x18.pdf"
]

for f in files:
    print(f"\n--- Checking {os.path.basename(f)} ---")
    if not os.path.exists(f):
        print("File not found.")
        continue
    doc = fitz.open(f)
    print(f"Number of pages: {doc.page_count}")
    page = doc[0]
    
    rect = page.rect
    w_mm = rect.width * 25.4 / 72
    h_mm = rect.height * 25.4 / 72
    print(f"Dimensions: {w_mm:.2f} x {h_mm:.2f} mm")
    
    print(f"MediaBox: {[round(x*25.4/72, 2) for x in page.mediabox]}")
    print(f"CropBox: {[round(x*25.4/72, 2) for x in page.cropbox]}")
    print(f"BleedBox: {[round(x*25.4/72, 2) for x in page.bleedbox]}")
    print(f"TrimBox: {[round(x*25.4/72, 2) for x in page.trimbox]}")
    print(f"ArtBox: {[round(x*25.4/72, 2) for x in page.artbox]}")
    
    fonts = doc.get_page_fonts(0)
    print(f"Fonts embedded: {len(fonts)}")
    if fonts:
        for font in fonts:
            print(f"  - {font[3]}")
    
    images = doc.get_page_images(0)
    print(f"Images: {len(images)}")
    for img in images:
        xref = img[0]
        base_image = doc.extract_image(xref)
        colorspace = base_image.get("colorspace", 0)
        cspace_str = "Unknown"
        if colorspace == 1: cspace_str = "Gray"
        elif colorspace == 3: cspace_str = "RGB"
        elif colorspace == 4: cspace_str = "CMYK"
        print(f"  - Image xref {xref}: colorspace={colorspace} ({cspace_str})")
        
    doc.close()
