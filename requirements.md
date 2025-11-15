## Flame and Forget – Requirements

- Single static web page, no backend dependencies.
- Page shows a quiet, contemplative background plus a central fire/trash can image.
- User can type a short phrase describing hated feature/data set.
- Submitting (Enter or clicking “Burn it and forget it” button) spawns a decorative note/post-it element showing the phrase.
- Note drops into the fire area and visually burns away/disappears; animation can be basic for v1.
- Page should feel playful/cathartic, leaving room for future polish (sound, synchronized sessions, multiple scenes).
- Future idea: multiple environmental scenes with prompts for generating artwork (track prompts in a separate file).

### Minimal Initial Version

1. Static `index.html` page that loads local CSS/JS (no build system).
2. Background image placeholder using royalty-free image (or gradient fallback).
3. Illustrative campfire/trash-can image included (local asset reference).
4. Input field + button (“Burn it and forget it”) wired via vanilla JS.
5. Generated note card uses CSS for paper styling; JS animates it falling/ fading via CSS transitions.
6. After animation completes, note element is removed from DOM.
7. Create `setting-prompts.md` listing scene prompt ideas for future artwork generation.
