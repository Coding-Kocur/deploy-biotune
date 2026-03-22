import win32com.client
import os
import urllib.request
from duckduckgo_search import DDGS
import time

dir_path = r"C:\Users\stani\OneDrive\Pulpit\PŁ_dokumenty\Engineering Project"
if not os.path.exists(dir_path):
    os.makedirs(dir_path)

def rgb(r, g, b):
    # COM RGB format is R + G*256 + B*65536
    return r + (g * 256) + (b * 65536)

import re

def download_image(query, filename):
    filepath = os.path.join(dir_path, filename)
    if os.path.exists(filepath):
        return filepath
        
    print(f"Searching Bing for: {query}")
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # Extract direct image URLs from Bing's murl
        murls = re.findall(r'murl&quot;:&quot;(http[^&]+)&quot;', html)
        for img_url in murls[:3]:
            try:
                req2 = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req2, timeout=10) as response, open(filepath, 'wb') as out_file:
                    out_file.write(response.read())
                print(f"Downloaded {filename} from {img_url}")
                return filepath
            except Exception as e2:
                print(f"Failed to download from {img_url}: {e2}")
    except Exception as e:
        print(f"Failed to search Bing: {e}")
    return filepath

# Fetch real accurate images
img_iron = download_image("gray cast iron microstructure industrial high res", "iron_bing.jpg")
img_pouring = download_image("foundry green sand casting pouring metal", "pouring_bing.jpg")
img_mold = download_image("shakeout machine casting foundry", "shakeout_bing.jpg")
img_cnc = download_image("cnc milling machine cutting steel block close up", "cnc_bing.jpg")
img_cmm = download_image("coordinate measuring machine touching metal part", "cmm_bing.jpg")

pptx_path = os.path.join(dir_path, "Engineering_Project_Casting.pptx")

ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = True
try:
    presentation = ppt.Presentations.Add()

    # Dark Corporate Theme Colors
    BG_COLOR = rgb(15, 23, 42)    # Slate 900
    TITLE_COLOR = rgb(56, 189, 248) # Sky 400
    TEXT_COLOR = rgb(241, 245, 249) # Slate 50
    ACCENT_COLOR = rgb(14, 165, 233)

    def apply_theme(slide):
        slide.FollowMasterBackground = False
        slide.Background.Fill.ForeColor.RGB = BG_COLOR
        # Subtle fade transition (ppEffectFade = 769)
        slide.SlideShowTransition.EntryEffect = 769
        slide.SlideShowTransition.Duration = 1.0

        for shape in slide.Shapes:
            if shape.HasTextFrame:
                tf = shape.TextFrame
                # Try to style Title vs Body based on placeholder type
                if shape.Type == 14: # Placeholder
                    # Determine if title by position or ID
                    if shape.Top < 50:
                        tf.TextRange.Font.Color.RGB = TITLE_COLOR
                        tf.TextRange.Font.Name = "Segoe UI Light"
                    else:
                        tf.TextRange.Font.Color.RGB = TEXT_COLOR
                        tf.TextRange.Font.Name = "Segoe UI"
                else:
                    tf.TextRange.Font.Color.RGB = TEXT_COLOR
                    tf.TextRange.Font.Name = "Segoe UI"

    def create_slide(layout_num, title, text=None, img_path=None):
        slide = presentation.Slides.Add(presentation.Slides.Count + 1, layout_num)
        apply_theme(slide)
        slide.Shapes[0].TextFrame.TextRange.Text = title
        if text and slide.Shapes.Count > 1:
            slide.Shapes[1].TextFrame.TextRange.Text = text
        
        if img_path and os.path.exists(img_path):
            # Right side placement for image: Left=430, Top=150, Width=270, Height=300
            slide.Shapes.AddPicture(img_path, False, True, 430, 150, 270, 300)
            
            # Reposition the text box to fit on the left
            if text and slide.Shapes.Count > 1:
                slide.Shapes[1].Width = 380
        return slide

    # Slide 1: Intro (Layout 1)
    slide1 = create_slide(1, "Manufacturing Process Design", "Technical Requirements & Automated Casting Layout\nStanley, Karol, Adam")
    
    # Slide 2: Requirements (Layout 2)
    create_slide(2, "Technical Requirements", "• Ferrous Alloy Casting\n• High Volume Production\n• Min. Tensile Strength: Rm ≥ 180 MPa\n• Critical Tolerances: Ø30H7, Ø10H8\n• Precision Slot: 20 +0.1/-0.0")
    
    # Slide 3: Material
    create_slide(2, "Material: Gray Cast Iron (EN-GJL-200)", "• Tensile Strength: 200 MPa (Meets >180 MPa)\n• Exceptional Castability for high volumes\n• Excellent Machinability\n• Vibration damping attributes", img_iron)
    
    # Slide 4: Stage 1 Casting
    create_slide(2, "Stage 1: Automated Green Sand Casting", "• Raw Material Storage\n• Induction Melting\n• Automated Molding & Sand Cores\n• Controlled Pouring Line", img_pouring)

    # Slide 5: Shakeout
    create_slide(2, "Shakeout & Initial Processing", "• Cooling Conveyor transit\n• Shakeout & Gate Removal\n• Shot Blasting for surface cleaning\n• Intermediate buffering storage", img_mold)

    # Slide 6: Heat Treatment & CNC
    create_slide(2, "Stage 2: Heat Treatment & Machining", "• Stress Relief Annealing (Prevents warp)\n• CNC Milling: Base Plane A, 20mm Slot\n• CNC Reaming & Drilling: Ø30H7, Ø10H8\n• Completely automated machining center", img_cnc)

    # Slide 7: Quality Control
    create_slide(2, "Quality Control & Dispatch", "• Dimensional Verification (±0.1 tolerances)\n• IT7 / IT8 Fits precise verification\n• Roughness checking\n• Final Packaging & Output", img_cmm)

    # Slide 8: Resources
    create_slide(2, "Resources", "• EN-GJL-200 Material Specifications (ISO 1561)\n• Geometrical Product Specifications (ISO GPS)\n• \"Casting Design and Performance\" (ASM)\n• Industry standard tolerance guidelines")

    # Slide 9: Thank you
    create_slide(1, "Thank You For Your Attention", "Questions & Discussion")

    presentation.SaveAs(pptx_path)
finally:
    # Do not quit so user can view the result immediately!
    print("Done generating perfectly formatted PPTX.")
