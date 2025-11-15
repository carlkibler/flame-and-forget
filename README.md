# Flame and Forget

Flame and Forget is a playful single-page experience for writing down nagging thoughts, watching them ignite inside a ceremonial trash can, and moving on. The interface is built from static HTML, CSS, and vanilla JavaScript—no build tooling or back-end services required.

## Development

1. Open `index.html` directly in your browser (or serve the folder with any static file server).
2. Tweak `style.css` for visuals or `script.js` for note behavior, localization strings, and animation timing.
3. Save and refresh to see changes.

## Building

To create a single self-contained HTML file (with CSS and JS inlined):

```bash
# Preview what will be built (dry run)
python3 build.py

# Actually create the bundled file
python3 build.py --live
```

This generates `dist/index.html` with all assets inlined, perfect for sharing or offline use.

## Deployment

Deploy to surge.sh:

```bash
# First time setup (if surge not installed)
npm install -g surge

# Build and deploy
python3 build.py --live
surge dist/

# Or specify the domain explicitly
surge dist/ flame-and-forget.surge.sh
```

After the first deployment, you can simply run `surge dist/` and it will remember your domain from the CNAME file.

## Files

- `index.html` – markup for the scene, including the textarea, queue, firepit, and history drawer.
- `style.css` – layout, palette, and animation styles (note drop/burn timings are exposed through CSS variables).
- `script.js` – queue management, localization data (including the Flame and Forget title), and card/animation logic.
- `build.py` – Python script to bundle HTML, CSS, and JS into a single self-contained file.
- `requirements.md` – original feature outline for Flame and Forget.
- `setting-prompts.md` – scene prompt ideas for future visual treatments.
