# PWA Icons Setup

The app requires icons for PWA installation. Placeholder files have been created.

## Generate Real Icons

### Option 1: Online Tool
1. Visit https://realfavicongenerator.net/
2. Upload a 512x512 PNG logo
3. Download and replace files in `frontend/images/`

### Option 2: Manual Creation
Create two PNG files:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

### Design Suggestions
- Use YouTube-related imagery (play button, download icon)
- Match app color scheme (#e94560 accent on #1a1a2e background)
- Keep design simple and recognizable at small sizes

### Quick Icon with ImageMagick
```bash
convert -size 512x512 xc:#1a1a2e -fill #e94560 -draw "circle 256,256 256,100" icon-512.png
convert icon-512.png -resize 192x192 icon-192.png
```
