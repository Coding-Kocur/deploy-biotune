from PIL import Image
import fitz
import sys

def analyze_pdf(f):
    print(f"\nAnalyzing: {f}")
    doc = fitz.open(f)
    images = doc.get_page_images(0)
    for img in images:
        xref = img[0]
        # Extract image
        pix = fitz.Pixmap(doc, xref)
        print(f"Pixmap colorspace: {pix.colorspace}")
        # CMYK check - let's sample some dark pixels
        if pix.colorspace.n == 4:
            # check the darkest pixels
            darkest = min([tuple(pix.pixel(x, y)) for x in range(0, pix.width, 100) for y in range(0, pix.height, 100)], key=lambda p: sum(p[:3]))
            print(f"Sample darkest pixel (C,M,Y,K): {darkest}")
            
analyze_pdf(r"C:\Users\stani\OneDrive\Pulpit\BioTune\Etykieta\Retatrutide 10 38x18.pdf")
