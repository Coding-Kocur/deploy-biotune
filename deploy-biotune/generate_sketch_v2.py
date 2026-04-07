import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import math
import os

# Create figure
fig, ax = plt.subplots(figsize=(10, 14))
ax.set_aspect('equal')
ax.axis('off')

lw_main = 2.0
lw_dim = 1.0

# ================= TOP VIEW =================

# Complex continuous outline
# We use angles in degrees
angle_tangent = math.degrees(math.atan2(25, -16.58)) # ~123.56
# Boss center (80, 0)
# Top fillet center (63.416, 25), arc from 270 to 303.56 (tangent)
# Boss arc from 123.56 through 0 to -123.56
# Bottom fillet center (63.416, -25), arc from 56.44 to 90

# Base outline coordinates
base_xs = [-10, -10, -5, -5, -10, -10, 10, 10]
base_ys = [-65, -10, -10, 10, 10, 65, 65, 25]
ax.plot(base_xs, base_ys, 'k-', lw=lw_main)

# Top base-arm fillet R5. Center (15, 25), tangency points (10, 25) and (15, 20)
ax.add_patch(patches.Arc((15, 25), 10, 10, theta1=180, theta2=270, color='k', lw=lw_main))

# Top arm straight edge
ax.plot([15, 63.416], [20, 20], 'k-', lw=lw_main)

# Top arm-boss fillet R5
ax.add_patch(patches.Arc((63.416, 25), 10, 10, theta1=270, theta2=270+(angle_tangent-90), color='k', lw=lw_main))

# Boss OD
ax.add_patch(patches.Arc((80, 0), 50, 50, theta1=-angle_tangent, theta2=angle_tangent, color='k', lw=lw_main))

# Bottom arm-boss fillet R5. theta1=90-(angle_tangent-90), theta2=90
ax.add_patch(patches.Arc((63.416, -25), 10, 10, theta1=180-angle_tangent, theta2=90, color='k', lw=lw_main))

# Bottom arm straight edge
ax.plot([15, 63.416], [-20, -20], 'k-', lw=lw_main)

# Bottom base-arm fillet R5. Center (15, -25)
ax.add_patch(patches.Arc((15, -25), 10, 10, theta1=90, theta2=180, color='k', lw=lw_main))

# Finish base right edge
ax.plot([10, 10], [-25, -65], 'k-', lw=lw_main)
ax.plot([10, -10], [-65, -65], 'k-', lw=lw_main)

# Holes
ax.add_patch(patches.Circle((80, 0), 15, fill=False, ec='k', lw=lw_main))
ax.add_patch(patches.Circle((0, 50), 5, fill=False, ec='k', lw=lw_main))
ax.add_patch(patches.Circle((0, -50), 5, fill=False, ec='k', lw=lw_main))

# Local section hatching (top hole)
hatch_xs = [-10, 10, 10, -10]
hatch_ys = [40, 40, 65, 65]
# Draw outline
ax.plot([-10, 10], [65, 65], 'k-', lw=lw_main)
ax.plot([-10, -10], [40, 65], 'k-', lw=lw_main)
ax.plot([10, 10], [40, 65], 'k-', lw=lw_main)
# Break line (squiggly)
th = np.linspace(0, 4*np.pi, 50)
sq_x = np.linspace(-10, 10, 50)
sq_y = 40 + 1.5 * np.sin(th)
ax.plot(sq_x, sq_y, 'k-', lw=1)

# Hatching manually for simple regions
for hy in np.arange(42, 65, 3):
    # Only hat outside the hole
    if abs(hy - 50) > 5:
        ax.plot([-10+1, 9], [hy, hy+2], 'k-', lw=0.5)

# Centerlines
ax.plot([-15, 110], [0, 0], 'k-.', lw=1) # Horizontal main
ax.plot([80, 80], [-35, 35], 'k-.', lw=1) # Boss vertical
ax.plot([0, 0], [-60, 60], 'k-.', lw=1) # Base vertical
ax.plot([-7, 7], [50, 50], 'k-.', lw=1) # Top hole horiz
ax.plot([-7, 7], [-50, -50], 'k-.', lw=1) # Bottom hole horiz

# Section A-A lines on main view
# Arrows pointing left through the boss (X=80, extending to Y=40 and Y=-40)
ax.annotate('', xy=(70, 45), xytext=(80, 45), arrowprops=dict(width=1.5, headwidth=8, color='k'))
ax.text(65, 45, 'A', ha='right', va='center', fontsize=14, fontweight='bold')
ax.plot([80, 80], [30, 50], 'k-', lw=3)

ax.annotate('', xy=(70, -45), xytext=(80, -45), arrowprops=dict(width=1.5, headwidth=8, color='k'))
ax.text(65, -45, 'A', ha='right', va='center', fontsize=14, fontweight='bold')
ax.plot([80, 80], [-30, -50], 'k-', lw=3)


# ================= DIMENSIONS =================
def ext_y(x, y1, y2): ax.plot([x,x], [y1, y2], 'k-', lw=0.8)
def ext_x(y, x1, x2): ax.plot([x1, x2], [y, y], 'k-', lw=0.8)

def dim_h(x1, x2, y, txt, exts=None):
    ax.annotate('', xy=(x1, y), xytext=(x2, y), arrowprops=dict(arrowstyle='<|-|>', color='k', lw=1))
    ax.text((x1+x2)/2, y+1.5, txt, ha='center', va='bottom', fontsize=10)
    if exts:
        ext_y(x1, exts[0], y+(4 if y>exts[0] else -4))
        ext_y(x2, exts[1], y+(4 if y>exts[1] else -4))

def dim_v(x, y1, y2, txt, exts=None):
    ax.annotate('', xy=(x, y1), xytext=(x, y2), arrowprops=dict(arrowstyle='<|-|>', color='k', lw=1))
    ax.text(x-2, (y1+y2)/2, txt, ha='right', va='center', rotation=90, fontsize=10)
    if exts:
        ext_x(y1, exts[0], x+(4 if x<exts[0] else -4))
        ext_x(y2, exts[1], x+(4 if x<exts[1] else -4))

# Left dims
dim_v(-35, -65, 65, '130', exts=(-10, -10))
dim_v(-20, -50, 50, '100 ± 0.1', exts=(0, 0))
dim_v(-10, -10, 10, '20  +0.1\n    -0.0', exts=None)
# Slot depth 5
ax.annotate('', xy=(-10, -6), xytext=(-5, -6), arrowprops=dict(arrowstyle='<|-|>', color='k', lw=1))
ax.text(-7.5, -4, '5', ha='center', va='bottom', fontsize=10)
ext_y(-10, -10, -3); ext_y(-5, -10, -3)

# Top dims
dim_h(-10, 10, 75, '20', exts=(65, 65))
# Hole Ø10H8
ax.annotate('Ø10H8', xy=(5, 50), xytext=(20, 60), arrowprops=dict(arrowstyle='->', lw=1), fontsize=10)

# Fillets
ax.annotate('R5', xy=(12, -22), xytext=(25, -40), arrowprops=dict(arrowstyle='->', lw=1), fontsize=10)
ax.annotate('R5', xy=(65, -23), xytext=(50, -40), arrowprops=dict(arrowstyle='->', lw=1), fontsize=10)

# Right dims (Boss)
dim_v(115, -25, 25, '50', exts=(80, 80))


# ================= SECTION A-A =================
sy = -100 # location Y
sx = 60   # location X
# Section A-A is width 35, height 50
# Hatching top block
ax.add_patch(patches.Rectangle((sx, sy+15), 35, 10, fill=False, ec='k', lw=lw_main, hatch='///'))
# Hatching bottom block
ax.add_patch(patches.Rectangle((sx, sy-25), 35, 10, fill=False, ec='k', lw=lw_main, hatch='///'))
# Hole lines
ax.plot([sx, sx+35], [sy+15, sy+15], 'k-', lw=lw_main)
ax.plot([sx, sx+35], [sy-15, sy-15], 'k-', lw=lw_main)
ax.plot([sx+17.5, sx+17.5], [sy-35, sy+35], 'k-.', lw=1) # centerline

ax.text(sx+17.5, sy+35, 'A-A', ha='center', fontsize=14, fontweight='bold')

# Dims for section
dim_h(sx, sx+35, sy+30, '35', exts=(sy+25, sy+25))
# Hole Ø30H7 (vertical dim)
ax.annotate('', xy=(sx+17.5, sy-15), xytext=(sx+17.5, sy+15), arrowprops=dict(arrowstyle='<|-|>', color='k', lw=1))
ax.text(sx+20, sy, 'Ø30H7', ha='left', va='center', rotation=90, fontsize=10)


# ================= ISOMETRIC VIEW =================
scale = 0.5
iso_ox, iso_oy = 60, -180

def iso(x, y, z):
    xi = (x * 0.866 - y * 0.866) * scale
    yi = (z - x * 0.5 - y * 0.5) * scale
    return xi + iso_ox, yi + iso_oy

def draw_line3d(p1, p2, **kwargs):
    xi1, yi1 = iso(*p1)
    xi2, yi2 = iso(*p2)
    ax.plot([xi1, xi2], [yi1, yi2], **kwargs)

def draw_box3d(x1, x2, y1, y2, z1, z2, **kwargs):
    pts = [(x1, y1, z2), (x2, y1, z2), (x2, y2, z2), (x1, y2, z2), (x1, y1, z2),
           (x1, y1, z1), (x2, y1, z1), (x2, y2, z1), (x1, y2, z1), (x1, y1, z1)]
    for i in range(4):
        draw_line3d(pts[i], pts[i+1], **kwargs)
        draw_line3d(pts[i+5], pts[i+6], **kwargs)
        draw_line3d(pts[i], pts[i+5], **kwargs)

def draw_cyl3d(xc, yc, z1, z2, R, **kwargs):
    t = np.linspace(0, 2*np.pi, 50)
    xi_top, yi_top = iso(xc + R*np.cos(t), yc + R*np.sin(t), np.full_like(t, z2))
    ax.plot(xi_top, yi_top, **kwargs)
    xi_bot, yi_bot = iso(xc + R*np.cos(t), yc + R*np.sin(t), np.full_like(t, z1))
    ax.plot(xi_bot, yi_bot, **kwargs)
    for angle in [np.pi/4, 5*np.pi/4]:
        draw_line3d((xc + R*np.cos(angle), yc + R*np.sin(angle), z1),
                    (xc + R*np.cos(angle), yc + R*np.sin(angle), z2), **kwargs)

# Draw 3D elements in black, slightly thinner
kw = dict(color='k', lw=1.0)
draw_box3d(-10, 10, -65, 65, 0, 35, **kw)    # Base
draw_box3d(-10, -5, -10, 10, 0, 35, color='gray', lw=0.5)  # Slot highlight 
draw_box3d(10, 55, -20, 20, 0, 35, **kw)     # Arm
draw_cyl3d(80, 0, 0, 35, 25, **kw)           # Boss OD
draw_cyl3d(80, 0, 0, 35, 15, **kw)           # Boss ID
draw_line3d((0, 50, 0), (0, 50, 35), color='gray', lw=0.5, linestyle='--') # Top hole
draw_line3d((0, -50, 0), (0, -50, 35), color='gray', lw=0.5, linestyle='--') # Bottom hole

# ================= TEXT =================
ax.text(-55, 0, 'Fig. 2. Data: ferrous alloy casting, high volume production, Rm min. = 180 MPa', 
        ha='center', va='center', rotation=90, fontsize=12)

# Save
save_path = r"C:\Users\stani\OneDrive\Pulpit\PŁ_dokumenty\Engineering Project\Technical_Sketch.png"
fig.savefig(save_path, bbox_inches='tight', dpi=300)
print(f"Blueprint saved to: {save_path}")
