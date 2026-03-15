import fitz
import sys

# 1. Transcript
pdf1_path = r"C:\Users\stani\OneDrive\Pulpit\PŁ_dokumenty\Karty ocen\Karta_OkresowychOsiagniec_Studenta-Stanis_aw_Kotowicz_257100_2025_26 Z-3.pdf"
try:
    doc1 = fitz.open(pdf1_path)
    print("--- TRANSCRIPT TEXT ---")
    for page in doc1:
        print(page.get_text())
except Exception as e:
    print(f"Error opening transcript: {e}")

# 2. Flyer Image
pdf2_path = r"C:\Users\stani\OneDrive\Pulpit\Ulotka_Korepetycje.pdf"
try:
    doc2 = fitz.open(pdf2_path)
    for page_num in range(len(doc2)):
        page = doc2[page_num]
        image_list = page.get_images()
        if image_list:
            # Let's extract the largest image assuming it's the photo
            largest_image = max(image_list, key=lambda img: img[2]*img[3] if len(img)>3 else 0)
            xref = largest_image[0]
            base_image = doc2.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            out_path = fr"C:\Users\stani\.gemini\antigravity\brain\edfda45c-f7f6-4701-b0e4-4ab39da2a81c\photo.{image_ext}"
            with open(out_path, "wb") as f:
                f.write(image_bytes)
            print(f"Extracted image to {out_path}")
except Exception as e:
    print(f"Error opening flyer: {e}")
