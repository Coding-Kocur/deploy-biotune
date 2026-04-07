import win32com.client
import os

file_path = r"C:\Users\stani\OneDrive\Pulpit\PŁ_dokumenty\Engineering Project\Engineering_Project_Casting.pptx"

ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = True

try:
    presentation = ppt.Presentations.Open(os.path.abspath(file_path))
except Exception as e:
    print(f"Error opening file: {e}")
    exit(1)

citations_1 = [
    "1. ISO 1561:2011, Founding — Grey cast irons. (EN-GJL-200 specs). https://www.iso.org/standard/53669.html",
    "2. Campbell, J. (2015). Complete Casting Handbook. Elsevier. https://www.sciencedirect.com/book/9780444635099/complete-casting-handbook",
    "3. American Foundry Society (AFS). Green Sand Molding Guidelines. https://www.afsinc.org/",
    "4. Kalpakjian, S., & Schmid, S. R. (2014). Manufacturing Engineering and Technology. Pearson. https://www.pearson.com/en-us/subject-catalog",
    "5. Groover, M. P. (2020). Fundamentals of Modern Manufacturing. Wiley. https://www.wiley.com/en-us/Fundamentals+of+Modern+Manufacturing",
    "6. ISO 286-1:2010 - Geometrical product specifications (GPS) — ISO code system for tolerances. https://www.iso.org/standard/45975.html",
    "7. Brown, J. R. (2000). Foseco Ferrous Foundryman's Handbook. Butterworth-Heinemann. https://www.sciencedirect.com/book/9780750642841"
]

citations_2 = [
    "8. Stefanescu, D. M. (2009). Science and Engineering of Casting Solidification. Springer. https://link.springer.com/book/10.1007/b139077",
    "9. Klocke, F. (2011). Manufacturing Processes 1: Cutting. Springer. (CNC Machining parameters). https://link.springer.com/book/10.1007/978-3-642-11979-8",
    "10. ASM International. (2008). ASM Handbook Volume 15: Casting. https://www.asminternational.org/asm-handbook-volume-15-casting/",
    "11. Nof, S. Y. (1999). Handbook of Industrial Robotics (Automated manufacturing). https://www.wiley.com/en-us/Handbook+of+Industrial+Robotics",
    "12. Hocken, R. J., & Pereira, P. H. (2011). Coordinate Measuring Machines and Systems. CRC Press. https://www.routledge.com/",
    "13. Totten, G. E. (2006). Steel Heat Treatment: Metallurgy and Technologies (Stress relief). CRC Press. https://www.routledge.com/",
    "14. \"Surface Roughness and Tool Wear in Milling of Gray Cast Iron.\" Journal of Materials Processing Technology. https://www.sciencedirect.com/journal/",
    "15. DISA Industries. Automated Vertical Green Sand Molding Technology. https://www.disagroup.com/en-gb/foundry-technologies/moulding"
]

res_slide_idx = -1
for i, slide in enumerate(presentation.Slides):
    for shape in slide.Shapes:
        if shape.HasTextFrame:
            txt = shape.TextFrame.TextRange.Text.lower()
            if "resources" in txt or "źródła" in txt or "bibliografia" in txt:
                res_slide_idx = i + 1
                break
    if res_slide_idx != -1:
        break

if res_slide_idx != -1:
    orig_slide = presentation.Slides(res_slide_idx)
    # Duplicate it
    duplicate_range = orig_slide.Duplicate()
    dup_slide = duplicate_range(1)
    
    # Process original slide (Resources 1/2)
    for shape in orig_slide.Shapes:
        if shape.HasTextFrame:
            txt = shape.TextFrame.TextRange.Text.lower()
            if "resources" in txt or "źródła" in txt or "bibliografia" in txt:
                shape.TextFrame.TextRange.Text = "Resources & Scientific References (1/2)"
            else:
                tf = shape.TextFrame
                tf.TextRange.Text = "\n".join(citations_1)
                # Ensure text fits and links are styled properly
                tf.TextRange.Font.Size = 14
                
    # Process duplicated slide (Resources 2/2)
    for shape in dup_slide.Shapes:
        if shape.HasTextFrame:
            txt = shape.TextFrame.TextRange.Text.lower()
            if "resources" in txt or "źródła" in txt or "bibliografia" in txt or "(1/2)" in txt:
                shape.TextFrame.TextRange.Text = "Resources & Scientific References (2/2)"
            else:
                tf = shape.TextFrame
                tf.TextRange.Text = "\n".join(citations_2)
                tf.TextRange.Font.Size = 14

    presentation.Save()
    print("Updated Resources slides successfully.")
else:
    print("Could not find the Resources slide!")

