# Cap photo drop-in guide

Save photos into the folder for each style. The configurator picks them up
automatically — no code changes needed. Until a file exists, that colorway
shows a plain color chip instead.

## Naming rule

```
public/images/caps/<styleId>/<color-slug>-front.png
public/images/caps/<styleId>/<color-slug>-side.png
```

`<color-slug>` = the color name, lowercased, `&` becomes `and`, and every run
of non-alphanumeric characters becomes a single dash:

| Color name | Slug | Front file |
|---|---|---|
| Black | `black` | `black-front.png` |
| Heather Gray | `heather-gray` | `heather-gray-front.png` |
| Black / White | `black-white` | `black-white-front.png` |
| Khaki & Black | `khaki-and-black` | `khaki-and-black-front.png` |
| Red/Wht | `red-wht` | `red-wht-front.png` |

The **front** image is required — it is used for both the big preview and the
thumbnail swatch. The **side** image is optional; without it the side tab falls
back to a mockup.

PNG (backgrounds removed), roughly 1200px on the long edge, under ~300KB each. Never commit images
larger than ~2000px — oversized source files crash mobile Safari.

## Important

A photo only appears if its slug matches a color listed in `COLORS_BY_STYLE`
(lib/products/caps.ts). **The color list drives the UI, not the folder contents** —
dropping in `navy-front.png` does nothing unless "Navy" is in that style's list.

Styles marked PLACEHOLDER below have guessed colorways, not real supplier
data. Update `COLORS_BY_STYLE` with the real names FIRST, then regenerate this
file — otherwise you will name everything twice.

## OTTO CAP 5 Panel Mid Profile Baseball Cap (A FRAME)
Blank cost $4.55 · folder `public/images/caps/otto-5-panel-aframe/`

✅ **Colorways confirmed** — 48 solids, photos supplied (front/side/back).

- Black: `black-front.png`, `black-side.png`, `black-back.png`
- Charcoal Gray: `charcoal-gray-front.png`, `charcoal-gray-side.png`, `charcoal-gray-back.png`
- Dark Brown: `dark-brown-front.png`, `dark-brown-side.png`, `dark-brown-back.png`
- Dark Green: `dark-green-front.png`, `dark-green-side.png`, `dark-green-back.png`
- Gray: `gray-front.png`, `gray-side.png`, `gray-back.png`
- Khaki: `khaki-front.png`, `khaki-side.png`, `khaki-back.png`
- Maroon: `maroon-front.png`, `maroon-side.png`, `maroon-back.png`
- Navy: `navy-front.png`, `navy-side.png`, `navy-back.png`
- Pink: `pink-front.png`, `pink-side.png`, `pink-back.png`
- Red: `red-front.png`, `red-side.png`, `red-back.png`
- Royal Blue: `royal-blue-front.png`, `royal-blue-side.png`, `royal-blue-back.png`
- White: `white-front.png`, `white-side.png`, `white-back.png`
- Yellow: `yellow-front.png`, `yellow-side.png`, `yellow-back.png`
- Black / Charcoal: `black-charcoal-front.png`, `black-charcoal-side.png`, `black-charcoal-back.png`
- Black / Gray: `black-gray-front.png`, `black-gray-side.png`, `black-gray-back.png`
- Black / Khaki: `black-khaki-front.png`, `black-khaki-side.png`, `black-khaki-back.png`
- Black / Natural: `black-natural-front.png`, `black-natural-side.png`, `black-natural-back.png`
- Black / Red: `black-red-front.png`, `black-red-side.png`, `black-red-back.png`
- Black / White: `black-white-front.png`, `black-white-side.png`, `black-white-back.png`
- Brown / Natural: `brown-natural-front.png`, `brown-natural-side.png`, `brown-natural-back.png`
- Caribbean Green / Natural: `caribbean-green-natural-front.png`, `caribbean-green-natural-side.png`, `caribbean-green-natural-back.png`
- Cool Blue / Natural: `cool-blue-natural-front.png`, `cool-blue-natural-side.png`, `cool-blue-natural-back.png`
- Gray / Navy: `gray-navy-front.png`, `gray-navy-side.png`, `gray-navy-back.png`
- Gray / Royal Blue: `gray-royal-blue-front.png`, `gray-royal-blue-side.png`, `gray-royal-blue-back.png`
- Green / Natural: `green-natural-front.png`, `green-natural-side.png`, `green-natural-back.png`
- Green / White: `green-white-front.png`, `green-white-side.png`, `green-white-back.png`
- Khaki / Natural: `khaki-natural-front.png`, `khaki-natural-side.png`, `khaki-natural-back.png`
- Lavender / Natural: `lavender-natural-front.png`, `lavender-natural-side.png`, `lavender-natural-back.png`
- Maroon / Gray: `maroon-gray-front.png`, `maroon-gray-side.png`, `maroon-gray-back.png`
- Maroon / Khaki: `maroon-khaki-front.png`, `maroon-khaki-side.png`, `maroon-khaki-back.png`
- Maroon / White: `maroon-white-front.png`, `maroon-white-side.png`, `maroon-white-back.png`
- Navy / Gray: `navy-gray-front.png`, `navy-gray-side.png`, `navy-gray-back.png`
- Navy / Khaki: `navy-khaki-front.png`, `navy-khaki-side.png`, `navy-khaki-back.png`
- Navy / Natural: `navy-natural-front.png`, `navy-natural-side.png`, `navy-natural-back.png`
- Navy / White: `navy-white-front.png`, `navy-white-side.png`, `navy-white-back.png`
- Pink / Natural: `pink-natural-front.png`, `pink-natural-side.png`, `pink-natural-back.png`
- Red / Black: `red-black-front.png`, `red-black-side.png`, `red-black-back.png`
- Red / Gray: `red-gray-front.png`, `red-gray-side.png`, `red-gray-back.png`
- Red / Khaki: `red-khaki-front.png`, `red-khaki-side.png`, `red-khaki-back.png`
- Red / Natural: `red-natural-front.png`, `red-natural-side.png`, `red-natural-back.png`
- Red / Navy: `red-navy-front.png`, `red-navy-side.png`, `red-navy-back.png`
- Red / Royal Blue: `red-royal-blue-front.png`, `red-royal-blue-side.png`, `red-royal-blue-back.png`
- Red / White: `red-white-front.png`, `red-white-side.png`, `red-white-back.png`
- Royal Blue / Black: `royal-blue-black-front.png`, `royal-blue-black-side.png`, `royal-blue-black-back.png`
- Royal Blue / Gray: `royal-blue-gray-front.png`, `royal-blue-gray-side.png`, `royal-blue-gray-back.png`
- Royal Blue / Natural: `royal-blue-natural-front.png`, `royal-blue-natural-side.png`, `royal-blue-natural-back.png`
- Royal Blue / White: `royal-blue-white-front.png`, `royal-blue-white-side.png`, `royal-blue-white-back.png`
- Sage Green / Natural: `sage-green-natural-front.png`, `sage-green-natural-side.png`, `sage-green-natural-back.png`

## OTTO CAP 5 Panel Pro Style Baseball Cap
Blank cost $5.10 · folder `public/images/caps/otto-5-panel-pro/`

✅ **Colorways confirmed** — 10 solids, photos supplied (front/side/back).

- Black: `black-front.png`, `black-side.png`, `black-back.png`
- Charcoal Gray: `charcoal-gray-front.png`, `charcoal-gray-side.png`, `charcoal-gray-back.png`
- Coyote Brown: `coyote-brown-front.png`, `coyote-brown-side.png`, `coyote-brown-back.png`
- Dark Brown: `dark-brown-front.png`, `dark-brown-side.png`, `dark-brown-back.png`
- Gray: `gray-front.png`, `gray-side.png`, `gray-back.png`
- Khaki: `khaki-front.png`, `khaki-side.png`, `khaki-back.png`
- Navy: `navy-front.png`, `navy-side.png`, `navy-back.png`
- Red: `red-front.png`, `red-side.png`, `red-back.png`
- Royal Blue: `royal-blue-front.png`, `royal-blue-side.png`, `royal-blue-back.png`
- White: `white-front.png`, `white-side.png`, `white-back.png`

## OTTO CAP 6 Panel Low Profile Dad Hat
Blank cost $5.35 · folder `public/images/caps/otto-6-panel-dad/`

✅ **Colorways confirmed** — 29 solids, photos supplied (front/back only, no side view).

- Azalea: `azalea-front.png`, `azalea-back.png`
- Black: `black-front.png`, `black-back.png`
- Bright Yellow: `bright-yellow-front.png`, `bright-yellow-back.png`
- Brown: `brown-front.png`, `brown-back.png`
- Charcoal Gray: `charcoal-gray-front.png`, `charcoal-gray-back.png`
- Dark Green: `dark-green-front.png`, `dark-green-back.png`
- Khaki: `khaki-front.png`, `khaki-back.png`
- Lake Blue: `lake-blue-front.png`, `lake-blue-back.png`
- Lime: `lime-front.png`, `lime-back.png`
- Maroon: `maroon-front.png`, `maroon-back.png`
- Navy: `navy-front.png`, `navy-back.png`
- Olive Green: `olive-green-front.png`, `olive-green-back.png`
- Orange: `orange-front.png`, `orange-back.png`
- Pink: `pink-front.png`, `pink-back.png`
- Purple: `purple-front.png`, `purple-back.png`
- Red: `red-front.png`, `red-back.png`
- Royal Blue: `royal-blue-front.png`, `royal-blue-back.png`
- Sky Blue: `sky-blue-front.png`, `sky-blue-back.png`
- Stone Gray: `stone-gray-front.png`, `stone-gray-back.png`
- White: `white-front.png`, `white-back.png`
- Yellow: `yellow-front.png`, `yellow-back.png`
- Black / Gray: `black-gray-front.png`, `black-gray-back.png`
- Black / Khaki: `black-khaki-front.png`, `black-khaki-back.png`
- Green / Khaki: `green-khaki-front.png`, `green-khaki-back.png`
- Khaki / Navy: `khaki-navy-front.png`, `khaki-navy-back.png`
- Navy / Gray: `navy-gray-front.png`, `navy-gray-back.png`
- Navy / Khaki: `navy-khaki-front.png`, `navy-khaki-back.png`
- Olive / Khaki: `olive-khaki-front.png`, `olive-khaki-back.png`
- Red / Black: `red-black-front.png`, `red-black-back.png`

## OTTO CAP 6 Panel Mid Profile Mesh Back Trucker Hat
Blank cost $4.10 · folder `public/images/caps/otto-6-panel-trucker/`

✅ **Colorways confirmed** — 49 colorways (18 solids + 31 two-tones), photos supplied (front/side/back).

- Black: `black-front.png`, `black-side.png`, `black-back.png`
- Black / White Stitch: `black-white-stitch-front.png`, `black-white-stitch-side.png`, `black-white-stitch-back.png`
- Charcoal Gray: `charcoal-gray-front.png`, `charcoal-gray-side.png`, `charcoal-gray-back.png`
- Charcoal Gray / White Stitch: `charcoal-gray-white-stitch-front.png`, `charcoal-gray-white-stitch-side.png`, `charcoal-gray-white-stitch-back.png`
- Navy: `navy-front.png`, `navy-side.png`, `navy-back.png`
- Navy / White Stitch: `navy-white-stitch-front.png`, `navy-white-stitch-side.png`, `navy-white-stitch-back.png`
- Dark Green: `dark-green-front.png`, `dark-green-side.png`, `dark-green-back.png`
- Dark Green / White Stitch: `dark-green-white-stitch-front.png`, `dark-green-white-stitch-side.png`, `dark-green-white-stitch-back.png`
- Royal Blue: `royal-blue-front.png`, `royal-blue-side.png`, `royal-blue-back.png`
- Red: `red-front.png`, `red-side.png`, `red-back.png`
- Maroon: `maroon-front.png`, `maroon-side.png`, `maroon-back.png`
- Burgundy: `burgundy-front.png`, `burgundy-side.png`, `burgundy-back.png`
- Purple: `purple-front.png`, `purple-side.png`, `purple-back.png`
- Olive Green: `olive-green-front.png`, `olive-green-side.png`, `olive-green-back.png`
- Khaki: `khaki-front.png`, `khaki-side.png`, `khaki-back.png`
- Texas Orange: `texas-orange-front.png`, `texas-orange-side.png`, `texas-orange-back.png`
- Gray: `gray-front.png`, `gray-side.png`, `gray-back.png`
- White: `white-front.png`, `white-side.png`, `white-back.png`
- Black / White: `black-white-front.png`, `black-white-side.png`, `black-white-back.png`
- Black / Red: `black-red-front.png`, `black-red-side.png`, `black-red-back.png`
- Black / Charcoal Gray: `black-charcoal-gray-front.png`, `black-charcoal-gray-side.png`, `black-charcoal-gray-back.png`
- Black / Khaki: `black-khaki-front.png`, `black-khaki-side.png`, `black-khaki-back.png`
- Navy / White: `navy-white-front.png`, `navy-white-side.png`, `navy-white-back.png`
- Navy / Charcoal Gray: `navy-charcoal-gray-front.png`, `navy-charcoal-gray-side.png`, `navy-charcoal-gray-back.png`
- Navy / Khaki: `navy-khaki-front.png`, `navy-khaki-side.png`, `navy-khaki-back.png`
- Charcoal Gray / White: `charcoal-gray-white-front.png`, `charcoal-gray-white-side.png`, `charcoal-gray-white-back.png`
- Charcoal Gray / Black: `charcoal-gray-black-front.png`, `charcoal-gray-black-side.png`, `charcoal-gray-black-back.png`
- Charcoal Gray / Royal Blue: `charcoal-gray-royal-blue-front.png`, `charcoal-gray-royal-blue-side.png`, `charcoal-gray-royal-blue-back.png`
- Red / White: `red-white-front.png`, `red-white-side.png`, `red-white-back.png`
- Red / Black: `red-black-front.png`, `red-black-side.png`, `red-black-back.png`
- Royal Blue / White: `royal-blue-white-front.png`, `royal-blue-white-side.png`, `royal-blue-white-back.png`
- Columbia Blue / White: `columbia-blue-white-front.png`, `columbia-blue-white-side.png`, `columbia-blue-white-back.png`
- Aqua / White: `aqua-white-front.png`, `aqua-white-side.png`, `aqua-white-back.png`
- Kelly Green / White: `kelly-green-white-front.png`, `kelly-green-white-side.png`, `kelly-green-white-back.png`
- Kelly Green / Black: `kelly-green-black-front.png`, `kelly-green-black-side.png`, `kelly-green-black-back.png`
- Dark Green / Khaki: `dark-green-khaki-front.png`, `dark-green-khaki-side.png`, `dark-green-khaki-back.png`
- Olive Green / White: `olive-green-white-front.png`, `olive-green-white-side.png`, `olive-green-white-back.png`
- Maroon / White: `maroon-white-front.png`, `maroon-white-side.png`, `maroon-white-back.png`
- Burgundy / Black: `burgundy-black-front.png`, `burgundy-black-side.png`, `burgundy-black-back.png`
- Purple / White: `purple-white-front.png`, `purple-white-side.png`, `purple-white-back.png`
- Hot Pink / White: `hot-pink-white-front.png`, `hot-pink-white-side.png`, `hot-pink-white-back.png`
- Hot Pink / Black: `hot-pink-black-front.png`, `hot-pink-black-side.png`, `hot-pink-black-back.png`
- Neon Orange / Black: `neon-orange-black-front.png`, `neon-orange-black-side.png`, `neon-orange-black-back.png`
- Texas Orange / Khaki: `texas-orange-khaki-front.png`, `texas-orange-khaki-side.png`, `texas-orange-khaki-back.png`
- Khaki / White: `khaki-white-front.png`, `khaki-white-side.png`, `khaki-white-back.png`
- Light Khaki / Dark Brown: `light-khaki-dark-brown-front.png`, `light-khaki-dark-brown-side.png`, `light-khaki-dark-brown-back.png`
- Brown / Khaki: `brown-khaki-front.png`, `brown-khaki-side.png`, `brown-khaki-back.png`
- Brown / Natural: `brown-natural-front.png`, `brown-natural-side.png`, `brown-natural-back.png`
- Dark Brown / Khaki: `dark-brown-khaki-front.png`, `dark-brown-khaki-side.png`, `dark-brown-khaki-back.png`

## PB311 Hybrid 5 Panel Perforated Rope
Blank cost $7.50 · folder `public/images/caps/pb311/`

✅ **Colorways confirmed** — 12 colorways, photos supplied (front/back only, no side view).

- Aqua / White: `aqua-white-front.png`, `aqua-white-back.png`
- Black / Black: `black-black-front.png`, `black-black-back.png`
- Black / White: `black-white-front.png`, `black-white-back.png`
- Burgundy / Black: `burgundy-black-front.png`, `burgundy-black-back.png`
- Gray / Black: `gray-black-front.png`, `gray-black-back.png`
- Navy / Red: `navy-red-front.png`, `navy-red-back.png`
- Navy / White: `navy-white-front.png`, `navy-white-back.png`
- Neon Green: `neon-green-front.png`, `neon-green-back.png`
- Olive / Black: `olive-black-front.png`, `olive-black-back.png`
- Olive / Gold: `olive-gold-front.png`, `olive-gold-back.png`
- Tan / Black: `tan-black-front.png`, `tan-black-back.png`
- Tan / White: `tan-white-front.png`, `tan-white-back.png`

## PB301 Hybrid Perforated Rope
Blank cost $7.50 · folder `public/images/caps/pb301/`

✅ **Colorways confirmed** — 4 solids with a speckled rope, photos supplied (front/back only, no side view).

- Black: `black-front.png`, `black-back.png`
- White: `white-front.png`, `white-back.png`
- Red: `red-front.png`, `red-back.png`
- Burgundy: `burgundy-front.png`, `burgundy-back.png`

## PB274C 5 Panel Two-Tone Camo
Blank cost $5.50 · folder `public/images/caps/pb274c/`

✅ **Colorways confirmed** — 8 two-tones, photos supplied (front only, no side or back).

- Cream / Cream Camo: `cream-cream-camo-front.png`
- Cream / Khaki Camo: `cream-khaki-camo-front.png`
- Cream / Green Camo: `cream-green-camo-front.png`
- Cream / Olive Camo: `cream-olive-camo-front.png`
- Cream / Navy Camo: `cream-navy-camo-front.png`
- Cream / Orange Camo: `cream-orange-camo-front.png`
- Cream / Tree Camo: `cream-tree-camo-front.png`
- Cream / Tree Camo 2: `cream-tree-camo-2-front.png`

## PB275 5 Panel High Frame Cream Two-Tone Meshback
Blank cost $5.00 · folder `public/images/caps/pb275/`

✅ **Colorways confirmed** — 8 two-tones, photos supplied (front only, no side or back).

- Cream / Black: `cream-black-front.png`
- Cream / Gray: `cream-gray-front.png`
- Cream / Navy: `cream-navy-front.png`
- Cream / Green: `cream-green-front.png`
- Cream / Brown: `cream-brown-front.png`
- Cream / Burgundy: `cream-burgundy-front.png`
- Cream / Red: `cream-red-front.png`
- Cream / Purple: `cream-purple-front.png`

## PB136K Khaki Two-Tone Low Profile
Blank cost $5.00 · folder `public/images/caps/pb136k/`

✅ **Colorways confirmed** — 8 two-tones, photos supplied (front/back only, no side view).

- Khaki / Black: `khaki-black-front.png`, `khaki-black-back.png`
- Khaki / Navy: `khaki-navy-front.png`, `khaki-navy-back.png`
- Khaki / Brown: `khaki-brown-front.png`, `khaki-brown-back.png`
- Khaki / Green: `khaki-green-front.png`, `khaki-green-back.png`
- Khaki / Olive: `khaki-olive-front.png`, `khaki-olive-back.png`
- Khaki / Red: `khaki-red-front.png`, `khaki-red-back.png`
- Khaki / Dark Denim: `khaki-dark-denim-front.png` — ⚠️ `khaki-dark-denim-back.png` MISSING (client sent a duplicate of the Navy back)
- Khaki / Light Denim: `khaki-light-denim-front.png`, `khaki-light-denim-back.png`

## PB222 Cambridge Mesh Trucker
Blank cost $4.75 · folder `public/images/caps/pb222/`

⚠️ **PLACEHOLDER colorways** (5) — replace before naming photos.

- Black / White: `black-white-front.png`, `black-white-side.png`
- Navy / White: `navy-white-front.png`, `navy-white-side.png`
- Charcoal / Black: `charcoal-black-front.png`, `charcoal-black-side.png`
- Khaki / Black: `khaki-black-front.png`, `khaki-black-side.png`
- Red / White: `red-white-front.png`, `red-white-side.png`

Total files expected: 458 across 10 styles — 442 supplied, 16 outstanding.

Outstanding: `pb222` (15) plus `pb136k/khaki-dark-denim-back.png` (1). `pb222` is the last
style still carrying PLACEHOLDER colorways, so its count is a guess until the real color
list lands.
