import sys
import json
import fitz  # PyMuPDF (pip install PyMuPDF)

PT_TO_MM = 25.4 / 72.0  # 1 Point = 0.352778 mm

def analyze_print_pdf(file_path: str, target_cut_w: float, target_cut_h: float, bleed_mm: float = 3.0):
    doc = fitz.open(file_path)
    total_pages = len(doc)
    
    first_page = doc[0]
    rect = first_page.rect
    detected_w = round(rect.width * PT_TO_MM, 1)
    detected_h = round(rect.height * PT_TO_MM, 1)

    expected_work_w = target_cut_w + (bleed_mm * 2)
    expected_work_h = target_cut_h + (bleed_mm * 2)

    has_bleed = (
        abs(detected_w - expected_work_w) <= 1.0 and 
        abs(detected_h - expected_work_h) <= 1.0
    )

    has_unoutlined_fonts = False
    unoutlined_font_names = set()
    has_rgb_images = False
    min_dpi = 9999

    for page_index in range(total_pages):
        page = doc[page_index]
        
        fonts = page.get_fonts(full=True)
        if len(fonts) > 0:
            has_unoutlined_fonts = True
            for f in fonts:
                unoutlined_font_names.add(f[3])

        image_list = page.get_images(full=True)
        for img_info in image_list:
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            colorspace = base_image.get("colorspace", 0)
            
            if colorspace == 3:
                has_rgb_images = True

            img_rects = page.get_image_rects(xref)
            if img_rects:
                placed_rect = img_rects[0]
                placed_width_inch = placed_rect.width / 72.0
                if placed_width_inch > 0:
                    effective_dpi = int(base_image["width"] / placed_width_inch)
                    if effective_dpi < min_dpi:
                        min_dpi = effective_dpi

    if min_dpi == 9999:
        min_dpi = 300

    result = {
        "detectedPages": total_pages,
        "detectedWidth": detected_w,
        "detectedHeight": detected_h,
        "hasBleed": has_bleed,
        "colorSpace": "RGB_MIXED" if has_rgb_images else "CMYK",
        "fontsOutlined": not has_unoutlined_fonts,
        "unoutlinedFontList": list(unoutlined_font_names),
        "minDpi": min_dpi
    }
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    cut_w = float(sys.argv[2])
    cut_h = float(sys.argv[3])
    analyze_print_pdf(pdf_path, cut_w, cut_h)
