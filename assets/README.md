# Assets Directory

This directory contains local copies of external libraries and resources to improve performance and enable offline functionality.

## Directory Structure

```
assets/
├── lib/
│   └── three/
│       ├── three.min.js (589 KB) - Production version (used in production)
│       └── three.js (1.1 MB) - Development version (for debugging)
└── README.md (this file)
```

## Downloaded Assets

### Three.js Library (v128)
- **Location**: `./lib/three/`
- **Files**:
  - `three.min.js` - Minified production version (optimized for performance)
  - `three.js` - Full source code version (for development and debugging)
- **Version**: r128
- **Size**: ~590 KB (minified), ~1.1 MB (development)
- **Usage**: Powers the interactive 3D globe visualization in the Skills section
- **Download Source**: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/

## Why Local Assets?

✅ **Performance**: Faster loading times (no external CDN latency)  
✅ **Offline Support**: Website works without internet connection  
✅ **Reliability**: No dependency on external CDN uptime  
✅ **Bandwidth**: Assets cached locally on user's machine  

## Implementation Details

The main `index.html` has been updated to reference the local Three.js:
```html
<!-- Before (CDN) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- After (Local) -->
<script src="./assets/lib/three/three.min.js"></script>
```

## Future Asset Management

If additional assets are needed:
1. Create appropriate subdirectories under `assets/`
2. Download/copy the asset files
3. Update HTML/CSS/JS to reference local paths
4. Update this README with new entries

### Suggested Future Assets to Consider
- Font Awesome icons (currently using CDN)
- Google Fonts (currently using CDN)
- Globe texture images (currently generated via canvas)
- Project preview images

## Notes

- The development version (`three.js`) is included for debugging purposes. You can remove it if disk space is a concern.
- Both minified and non-minified versions are included for flexibility during development.
- The portfolio continues to use Google Fonts and Font Awesome from CDN for typography and icons (easily convertible to local if needed).

---

**Last Updated**: July 9, 2026  
**Total Assets Size**: ~1.7 MB
