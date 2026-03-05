import fitz

def check_k(f):
    doc = fitz.open(f)
    img = doc.get_page_images(0)[0]
    pix = fitz.Pixmap(doc, img[0])
    
    max_k = 0
    max_k_cmy = (0,0,0)
    
    for y in range(0, pix.height, 10):
        for x in range(0, pix.width, 10):
            p = pix.pixel(x, y)
            if len(p) >= 4:
                k = p[3]
                if k > max_k:
                    max_k = k
                    max_k_cmy = p[:3]
                if k == 255 and sum(p[:3]) > 0:
                    print(f"Rich black found: {p}")
                    return True
    
    print(f"Max K found: {max_k}, with CMY: {max_k_cmy}")
    return False
    
check_k(r"C:\Users\stani\OneDrive\Pulpit\BioTune\Etykieta\Retatrutide 10 38x18.pdf")
