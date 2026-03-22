import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

# Create figure
fig, ax = plt.subplots(figsize=(12, 12))
ax.set_aspect('equal')
ax.axis('off')

# ================= TOP VIEW =================

# 1. Base Outline & Arms
xs = [50, 50, 55, 55, 50, 50, 70, 70]
ys = [85, 140, 140, 160, 160, 215, 215, 180]
ax.plot(xs, ys, 'k-', lw=2.5)

# Top & Bottom Fillets R5
# Center is (75, 180) and (75, 120)
ax.add_patch(patches.Arc((75, 180), 10, 10, theta1=90, theta2=180, color='k', lw=2.5))
ax.add_patch(patches.Arc((75, 120), 10, 10, theta1=180, theta2=270, color='k', lw=2.5))

# Connecting Arms
ax.plot([75, 150], [175, 175], 'k-', lw=2.5)
ax.plot([75, 150], [125, 125], 'k-', lw=2.5)

# Boss right half
ax.add_patch(patches.Arc((150, 150), 50, 50, theta1=-90, theta2=90, color='k', lw=2.5))

# Base interior closing lines
ax.plot([70, 70], [120, 85], 'k-', lw=2.5)
ax.plot([70, 50], [85, 85], 'k-', lw=2.5)

# 2. Holes
ax.add_patch(patches.Circle((150, 150), 15, fill=False, ec='k', lw=2.5))
ax.add_patch(patches.Circle((60, 200), 5, fill=False, ec='k', lw=2.5))
ax.add_patch(patches.Circle((60, 100), 5, fill=False, ec='k', lw=2.5))

# 3. Centerlines
ax.plot([25, 195], [150, 150], 'k-.', lw=1)
ax.plot([150, 150], [110, 190], 'k-.', lw=1)
ax.plot([60, 60], [70, 230], 'k-.', lw=1)
ax.plot([45, 75], [200, 200], 'k-.', lw=1)
ax.plot([45, 75], [100, 100], 'k-.', lw=1)

# Section A-A lines and arrows
ax.annotate('', xy=(30, 165), xytext=(30, 150), arrowprops=dict(width=1.5, headwidth=8, color='k'))
ax.text(30, 172, 'A', ha='center', fontsize=14, fontweight='bold')
ax.annotate('', xy=(190, 165), xytext=(190, 150), arrowprops=dict(width=1.5, headwidth=8, color='k'))
ax.text(190, 172, 'A', ha='center', fontsize=14, fontweight='bold')

# 4. Dimensions helper functions
def ext_y(x, y1, y2): ax.plot([x,x], [y1, y2], 'k-', lw=0.8)
def ext_x(y, x1, x2): ax.plot([x1, x2], [y, y], 'k-', lw=0.8)

def dim_h(x1, x2, y, txt, exts=None):
    ax.annotate('', xy=(x1, y), xytext=(x2, y), arrowprops=dict(arrowstyle='<|-|>', color='k', lw=1.5))
    ax.text((x1+x2)/2, y+2, txt, ha='center', va='bottom', fontsize=12)
    if exts:
        ext_y(x1, exts[0], y+(5 if y>exts[0] else -5))
        ext_y(x2, exts[1], y+(5 if y>exts[1] else -5))

def dim_v(x, y1, y2, txt, exts=None):
    ax.annotate('', xy=(x, y1), xytext=(x, y2), arrowprops=dict(arrowstyle='<|-|>', color='k', lw=1.5))
    ax.text(x-3, (y1+y2)/2, txt, ha='right', va='center', rotation=90, fontsize=12)
    if exts:
        ext_x(y1, exts[0], x+(5 if x<exts[0] else -5))
        ext_x(y2, exts[1], x+(5 if x<exts[1] else -5))

# Top view dimensions
dim_v(25, 85, 215, '130', exts=(50, 50))
dim_v(40, 100, 200, '100 ± 0.1', exts=(60, 60))
dim_v(45, 140, 160, '20 +0.1/-0.0', exts=(50, 50))
dim_h(50, 55, 130, '5', exts=(140, 140))
dim_h(50, 70, 230, '20', exts=(215, 215))

# Fillet annotation
ax.annotate('R5', xy=(72, 122), xytext=(90, 105), arrowprops=dict(arrowstyle='->', lw=1.5), fontsize=12)

# Diameters
ax.annotate('Ø30H7', xy=(140, 140), xytext=(110, 110), arrowprops=dict(arrowstyle='->', lw=1.5), fontsize=12)
ax.annotate('Ø10H8', xy=(65, 205), xytext=(85, 220), arrowprops=dict(arrowstyle='->', lw=1.5), fontsize=12)
dim_v(185, 125, 175, '50', exts=(150, 150))

# ================= SECTION A-A =================
sy = 20 # Y offset for section
ax.text(180, sy+17, 'A-A', fontsize=16, fontweight='bold', ha='center')

# Hatching
ax.add_patch(patches.Rectangle((55, sy), 80, 35, fill=False, ec='k', lw=2.5, hatch='//'))
ax.add_patch(patches.Rectangle((165, sy), 10, 35, fill=False, ec='k', lw=2.5, hatch='//'))

# Section hole lines
ax.plot([135, 165], [sy, sy], 'k-', lw=2.5)
ax.plot([135, 165], [sy+35, sy+35], 'k-', lw=2.5)
ax.plot([150, 150], [sy-10, sy+45], 'k-.', lw=1)

# Base closing on left (from slot)
ax.plot([55, 55], [sy, sy+35], 'k-', lw=2.5)

# Section dimensions
dim_v(200, sy, sy+35, '35', exts=(175, 175))
dim_h(135, 165, sy-15, 'Ø30H7', exts=(sy, sy))

# Adding boss dimension 50 to section too
# boss is 125 to 175
dim_h(125, 175, sy-25, 'Ø50', exts=(sy+35, sy+35))

# ================= TEXT =================
ax.text(100, -20, 'Fig. 2. Data: ferrous alloy casting, high volume production, Rm min. = 180 MPa', ha='center', fontsize=14, fontstyle='italic')

# ISOMETRIC DUMMY
ax.text(170, 70, '[ Isometric View ]\n(See 3D Model)', ha='center', fontsize=12, color='gray')

# Save
save_path = r"C:\Users\stani\OneDrive\Pulpit\PŁ_dokumenty\Engineering Project\Technical_Sketch.png"
fig.savefig(save_path, bbox_inches='tight', dpi=300)
print(f"Blueprint saved to: {save_path}")
