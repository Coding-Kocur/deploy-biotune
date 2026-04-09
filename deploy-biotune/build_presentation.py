import win32com.client
import os
import urllib.request
import time

def download_image(url, filename):
    filepath = os.path.join(os.path.dirname(__file__), filename)
    if not os.path.exists(filepath):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
    return filepath

dir_path = os.path.dirname(os.path.abspath(__file__))

# Image URLs (LoremFlickr fetches real images from Flickr based on tags)
img_iron = download_image("https://loremflickr.com/800/600/cast,iron,metal", "iron.jpg")
img_pouring = download_image("https://loremflickr.com/800/600/foundry,pouring,metal", "pouring.jpg")
img_mold = download_image("https://loremflickr.com/800/600/sand,casting,mold", "mold.jpg")
img_cnc = download_image("https://loremflickr.com/800/600/cnc,milling,machine", "cnc.jpg")
img_cmm = download_image("https://loremflickr.com/800/600/industrial,measuring", "cmm.jpg")
pptx_path = os.path.join(dir_path, "Engineering_Project_Casting.pptx")
docx_path = os.path.join(dir_path, "Presentation_Script.docx")

# 1. Create Word Document
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
doc = word.Documents.Add()
selection = word.Selection

def add_script(speaker, slide_num, title, text):
    selection.Font.Bold = True
    selection.Font.Size = 14
    selection.TypeText(f"Slide {slide_num}: {title} (Speaker: {speaker})\n")
    selection.Font.Bold = False
    selection.Font.Size = 12
    selection.TypeText(f"{text}\n\n")

# Script Content
selection.Font.Bold = True
selection.Font.Size = 18
selection.TypeText("Presentation Script: Technical Requirements & Casting Layout\n\n")

add_script("Stanley", 1, "Introduction", "Good morning everyone. Today we will present our engineering project on the manufacturing process design for a mechanical cast part. We will walk you through the technical requirements, the material selection, and our complete two-stage manufacturing strategy involving automated green sand casting and CNC machining.")
add_script("Stanley", 2, "Technical Requirements & Justification", "Let's start with the requirements derived directly from our technical drawing. The part is required to be a ferrous alloy casting, intended for high-volume production, with a minimum tensile strength (Rm) of 180 MPa. It features critical functional surfaces: a main hole requiring an H7 tolerance, mounting holes with an H8 tolerance, and a precision slot. Because of the high volume and shape complexity, a casting approach followed by precision machining is the only economically viable path.")
add_script("Stanley", 3, "Material Selection", "To meet the 180 MPa tensile requirement, we selected Gray Cast Iron, specifically EN-GJL-200. This material offers a minimum tensile strength of 200 MPa, providing a comfortable safety margin. Gray cast iron is renowned for its excellent castability, vibration damping, and superior machinability, making it the perfect choice for our automated green sand casting process.")
add_script("Karol", 4, "Manufacturing Strategy: Stage 1", "Thank you, Stanley. Moving to our manufacturing workflow. Stage 1 is the casting process itself. Our layout begins with the raw material storage where we keep scrap, EN-GJL-200 ingots, and molding sand. These materials are transported to the induction furnace. Here, we melt the iron. Simultaneously, our automated molding lines prepare the green sand molds with sand cores for the main 30mm hole. The molds are then poured automatically.")
add_script("Karol", 5, "Shakeout & Intermediate Storage", "After pouring, the cooling conveyor transports the molds to the shakeout station. This is our second major operation. The castings are broken out, gating systems are removed, and the parts undergo shot blasting to remove any residual sand. The raw, cleaned castings then enter an intermediate buffer storage, awaiting their thermal treatment.")
add_script("Adam", 6, "Heat Treatment & CNC Machining", "Thanks Karol. I will cover the post-casting stages. Before any machining, the castings undergo stress relief annealing. This crucial step removes internal casting stresses, preventing any deformation or warping during the subsequent milling. Once cooled, they are sent to the CNC machining center. In one automated setup, we mill the base plane and the 20mm slot, ream the main 30mm H7 hole, and drill the 10mm H8 mounting holes.")
add_script("Adam", 7, "Quality Control & Dispatch", "After machining, the parts are moved to our Quality Control station. We strictly verify the critical dimensional tolerances, particularly the 100mm ±0.1 dimension, the H7/H8 fits, and surface roughness. Passed components are finally transported to packaging and enter our finished goods warehouse, ready for customer dispatch.")
add_script("Adam", 8, "Resources & Conclusion", "In our design, we relied on industry standards for EN-GJL-200, ISO geometrical product specifications, and casting guidelines. Thank you very much for your attention. We are now open for any questions regarding our process map or technical justifications.")

doc.SaveAs(docx_path)
doc.Close()
word.Quit()

# 2. Create PowerPoint
ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = True  # Show the PPT being created!
try:
    presentation = ppt.Presentations.Add()

    # Layouts: 1=Title, 2=Title&Text, 5=Title Only, 6=Blank
    
    # Slide 1: Intro
    slide1 = presentation.Slides.Add(1, 1)
    slide1.Shapes[0].TextFrame.TextRange.Text = "Manufacturing Process Design"
    slide1.Shapes[1].TextFrame.TextRange.Text = "Technical Requirements & Automated Casting Layout\nStanley, Karol, Adam"

    # Slide 2: Requirements
    slide2 = presentation.Slides.Add(2, 2)
    slide2.Shapes[0].TextFrame.TextRange.Text = "Technical Requirements"
    text2 = slide2.Shapes[1].TextFrame.TextRange
    text2.Text = "• Ferrous Alloy Casting\n• High Volume Production\n• Min. Tensile Strength (Rm) = 180 MPa\n• Critical Tolerances: Ø30H7, Ø10H8"
    
    # Slide 3: Material
    slide3 = presentation.Slides.Add(3, 5) # Title only
    slide3.Shapes[0].TextFrame.TextRange.Text = "Material: Gray Cast Iron (EN-GJL-200)"
    slide3.Shapes.AddTextbox(1, 50, 100, 300, 100).TextFrame.TextRange.Text = "• UTS: 200 MPa (>180 MPa)\n• Exceptional Castability\n• Excellent Machinability\n• Cost-effective for high volume"
    slide3.Shapes.AddPicture(img_iron, False, True, 400, 150, 300, 200)

    # Slide 4: Stage 1 Casting
    slide4 = presentation.Slides.Add(4, 5)
    slide4.Shapes[0].TextFrame.TextRange.Text = "Stage 1: Automated Green Sand Casting"
    slide4.Shapes.AddTextbox(1, 50, 100, 300, 150).TextFrame.TextRange.Text = "• Raw Material Storage\n• Induction Melting\n• Automated Molding & Sand Cores\n• Pouring Line"
    slide4.Shapes.AddPicture(img_pouring, False, True, 400, 150, 300, 200)

    # Slide 5: Shakeout
    slide5 = presentation.Slides.Add(5, 5)
    slide5.Shapes[0].TextFrame.TextRange.Text = "Cooling & Shakeout"
    slide5.Shapes.AddTextbox(1, 50, 100, 300, 150).TextFrame.TextRange.Text = "• Cooling Conveyor\n• Shakeout & Gate Removal\n• Shot Blasting (Sand Removal)\n• Intermediate Storage"
    slide5.Shapes.AddPicture(img_mold, False, True, 400, 150, 300, 200)

    # Slide 6: Heat Treatment & CNC
    slide6 = presentation.Slides.Add(6, 5)
    slide6.Shapes[0].TextFrame.TextRange.Text = "Stage 2: Heat Treatment & CNC"
    slide6.Shapes.AddTextbox(1, 50, 100, 400, 150).TextFrame.TextRange.Text = "• Stress Relief Annealing (Prevent warping)\n• CNC Milling (Base Plane A, 20mm Slot)\n• CNC Reaming & Drilling (Ø30H7, Ø10H8)"
    slide6.Shapes.AddPicture(img_cnc, False, True, 400, 200, 300, 200)

    # Slide 7: Quality Control
    slide7 = presentation.Slides.Add(7, 5)
    slide7.Shapes[0].TextFrame.TextRange.Text = "Quality Control & Dispatch"
    slide7.Shapes.AddTextbox(1, 50, 100, 300, 150).TextFrame.TextRange.Text = "• Dimensional Verification (±0.1)\n• IT7 / IT8 Fits Verification\n• Surface Roughness Check\n• Final Packaging & Dispatch"
    slide7.Shapes.AddPicture(img_cmm, False, True, 400, 150, 300, 200)

    # Slide 8: Resources
    slide8 = presentation.Slides.Add(8, 2)
    slide8.Shapes[0].TextFrame.TextRange.Text = "Resources"
    slide8.Shapes[1].TextFrame.TextRange.Text = "• EN-GJL-200 Material Specifications (ISO 1561)\n• Geometrical Product Specifications (GPS)\n• \"Casting Design and Performance\" - ASM International\n• Real-world Foundry Best Practices"

    # Slide 9: Thank you
    slide9 = presentation.Slides.Add(9, 1)
    slide9.Shapes[0].TextFrame.TextRange.Text = "Thank You For Your Attention"
    slide9.Shapes[1].TextFrame.TextRange.Text = "Questions?"

    presentation.SaveAs(pptx_path)
finally:
    ppt.Quit()

print("Done generating DOCX and PPTX.")
