"""Optional asset regeneration: python with Pillow, Microsoft YaHei on Windows."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
image = Image.new("RGB", (1200, 630))
pixels = image.load()
for y in range(630):
    for x in range(1200):
        mix = (x / 1200 + y / 630) / 2
        pixels[x, y] = (int(27 + 47 * mix), int(25 + 29 * mix), int(57 + 91 * mix))
draw = ImageDraw.Draw(image)
font_path = Path("C:/Windows/Fonts/msyh.ttc")
if not font_path.exists():
    raise SystemExit("Set font_path to an installed Chinese font before regenerating.")
font = lambda size: ImageFont.truetype(str(font_path), size)
for radius in (90, 170, 260):
    draw.ellipse((960-radius, 220-radius, 960+radius, 220+radius), outline=(102, 90, 164), width=2)
draw.line([(570, 450), (760, 345), (960, 220), (1140, 165)], fill=(174, 230, 247), width=4)
for x, y, radius in ((570, 450, 9), (760, 345, 12), (960, 220, 16), (1140, 165, 8)):
    draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=(209, 244, 255))
draw.rounded_rectangle((64, 55, 114, 105), radius=14, fill=(122, 91, 255))
draw.polygon([(75, 92), (89, 65), (103, 92), (95, 92), (89, 81), (83, 92)], fill="white")
draw.text((132, 59), "选机场", font=font(30), fill="white")
draw.text((64, 165), "把选择做简单", font=font(74), fill="white")
draw.text((64, 265), "机场推荐 · 品牌测评 · 客户端指南", font=font(29), fill=(208, 203, 239))
draw.rounded_rectangle((64, 382, 590, 483), radius=17, fill=(92, 65, 191))
draw.text((87, 399), "光年梯  ¥18 / 月 · 120GB · IEPL", font=font(25), fill="white")
draw.text((87, 439), "套餐分析与优惠信息，更新日期见文章", font=font(17), fill=(221, 214, 250))
draw.text((64, 555), "XJICHANG.COM", font=font(22), fill=(184, 173, 230))
draw.text((863, 558), "选购有依据  ·  信息有边界", font=font(17), fill=(184, 173, 230))
image.save(ROOT / "public" / "og-default.png", optimize=True)
print("Created public/og-default.png (1200 × 630)")
