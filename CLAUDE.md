# Claude Instructions

## Project: Weave Pattern Simulator

A 3D weaving pattern visualization tool built with React, TypeScript, and Three.js.

### Important Instructions

1. **Always run `npm test` after making code edits** - This runs TypeScript type checking to ensure code quality and catch type errors early.

2. **Development Commands:**
   - `npm run dev` - Start development server at http://localhost:5173/
   - `npm run build` - Build for production to `/docs` folder (for GitHub Pages)
   - `npm test` - Run TypeScript type checking

### Project Details

**Tech Stack:**
- Vite as build tool
- React with TypeScript
- Three.js + React Three Fiber for 3D rendering
- Deployed to GitHub Pages at https://simonlast.org/weave3d/

**Key Features:**
- 4 weave patterns: plain, twill, satin, basket
- Interactive 3D visualization with top-down view
- Left sidebar with controls (collapsible)
- Customizable properties:
  - Zoom (10-50, default: 30)
  - Thread spacing (0.3-1.3, default: 0.8)
  - Thread thickness (0.1-0.5, default: 0.28)
  - Weave height (0.1-0.6, default: 0.3)
  - Grid size (15-50, default: 33)
  - Thread colors with 6 presets each

**Interaction:**
- Click and drag to pan
- Scroll/trackpad to zoom (centered on mouse)
- No rotation (locked top-down view)

**Build Configuration:**
- Outputs to `/docs` folder (not `/dist`)
- Base URL: `/` for dev, `/weave3d/` for production
- Includes `.nojekyll` file for GitHub Pages

### Testing Workflow

After any code changes:
```bash
npm test
```

This ensures all TypeScript types are correct before committing changes.