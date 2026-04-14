# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Flame and Forget is a static single-page cathartic experience: users type a thought, watch it burn in an animated fire, and move on. No backend, no npm, no build system required for development.

## Development

Open `index.html` directly in a browser. No server needed. Save and refresh to see changes.

## Build & Deploy

```bash
# Dry run (shows what would be bundled)
python3 build.py

# Bundle CSS + JS inline into dist/index.html
python3 build.py --live

# Deploy to surge.sh (flame-and-forget.surge.sh via dist/CNAME)
surge dist/
```

`build.py` inlines `style.css` and `script.js` into `index.html` to produce a single self-contained file in `dist/`.

## Architecture

Three source files:

- **`index.html`** — all markup. Fire styles (original/realistic/mystical/minimalist) are pre-rendered as inline SVGs inside `.flame-container[data-fire-style]`. JS switches between them via `data-fire-style` attribute. i18n surface: `data-i18n` attributes on elements, `data-i18n-placeholder` for inputs.

- **`style.css`** — animation timing exposed as CSS variables (`--note-drop-duration`, `--note-burn-duration`, `--flame-scale`, `--flame-brightness`) so JS can drive timing from a single source.

- **`script.js`** — orchestrates everything:
  - **Burn queue** (`burnQueue` array, `processingQueue` flag) — items burn one at a time with configurable `itemDelay` between them
  - **Card lifecycle**: text entered → card created with pastel color from `pastelPalette` → dropped into `.note-layer` → CSS transition falls it toward `.fire-target` → burn animation → DOM removal → entry added to release log
  - **i18n**: `LANGUAGES` object maps locale codes to translation strings; `applyTranslations()` walks `data-i18n` nodes
  - **Settings** persisted to `localStorage` under `STORAGE_KEYS.settings`; defaults in `DEFAULT_SETTINGS`
  - **Release log** persisted to `localStorage` under `STORAGE_KEYS.releaseLog`; `STORAGE_KEYS.rememberItems` controls whether saving is active

## Key Conventions

- Animation timing: change `DEFAULT_SETTINGS` values in `script.js`; CSS variables are set from these at runtime via `root.style.setProperty`
- Fire style switching: set `flameContainer.dataset.fireStyle` + toggle `.active` on `.fire-style-btn` elements
- Adding a new language: add an entry to the `LANGUAGES` object in `script.js` and populate all translation keys
- The `script.js.bak` file in the repo root is a leftover backup — ignore it


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
