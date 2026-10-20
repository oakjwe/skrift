# Skrift

Local handwriting worksheet editor with automatic preview, browser persistence,
formatting helpers, supplied Icelandic handwriting fonts, and A4 printing.
No build step, package installation, external requests, or backend is required.

## Run locally

From the repository root, start a read-only local web server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/app/**. Stop the server with Ctrl+C.
Serve the repository root, because the fonts are loaded from `mms/`.
The server is bound to this computer only. This is a development command, not a
production deployment. Do not use `file://`; browser storage behavior varies.

## Use

- Type text: preview updates automatically and the editor keeps its contents.
- Text and settings are saved in localStorage for this browser and origin.
  Clearing browser data removes them; other devices/browsers do not share them.
- Enter or `{br}` starts a row. `{blank}` inserts one blank practice row.
- `{page}` starts a fresh page. Escape a token with a backslash (`\{br}`) to
  print the literal token. Unknown tokens are printed literally.
- Long text wraps onto more rows/pages. Blank space at the bottom remains ruled.
- Choose print, A4 portrait, scale 100%, and disable browser headers/footers.
  Preview and print share the same page DOM and physical dimensions.

No content is interpreted as HTML. Assets and data stay local. The original MMS
reference is preserved; font redistribution licensing has not been verified.
See PROJECT.md for context and docs/references/ for the original screenshots.

## Validation

Browser behavior and print alignment should be checked with the supplied fonts
on the target OS. The original Windows font-position adjustment is retained.

Run the optional logic checks when GNOME JavaScript (`gjs`) is available:

```bash
gjs tests/check.js
```

These use DOM doubles and do not replace visual/browser print testing.
