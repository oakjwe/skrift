# Skrift — project context and handoff

Updated: 2026-10-20

## Purpose and authorization

Build a locally hosted handwriting worksheet website for teachers, inspired by
Skriftarsmiðjan. This is a personal software project, not coursework.
The user authorized local implementation after documentation and Git initialization.
A first local implementation now exists in app/. Do not infer permission to deploy, push,
modify infrastructure, or restart live services.

## Confirmed requirements

- Provide a similar worksheet-building experience to the original page.
- Update the worksheet preview automatically as text or settings change; remove
  the need to click “Bæta við texta”.
- Keep the entered text visible in the editor. Never clear it when updating preview.
- Persist entered text between sessions. Browser localStorage is a reasonable
  initial approach, but storage architecture has not been explicitly chosen.
- Support helper text/characters to control formatting, including line breaks and
  newlines. Exact syntax and distinctions between formatting commands remain to
  be agreed; show teachers understandable examples when implemented.
- Allow printing the finished worksheet through a print action.
- Host locally; no WordPress requirement or chosen application stack yet.
- Icelandic UI and full Icelandic character support fit the source and audience.

## Visual references

Screenshots supplied by the user are preserved in docs/references:

- original-full-page.png: full layout, green heading banner with bee illustration,
  left settings column, editor and buttons above a portrait worksheet, footer.
  Shows light tracing text.
- original-before-submit.png: editor contains new text while preview still shows
  the previous “test” text. This manual-update behavior should be improved.
- original-after-submit.png: text moved to worksheet, wraps over two rows, and
  editor was cleared. The replacement should preserve text and update live.

Use these as visual references, not an instruction to reproduce all branding,
menus, artwork, or footer content. Exact visual design remains open.

## Existing reference files

mms/ contains a downloaded reference, not a runnable application of our own:

- skriftarsmiðjan: UTF-8 HTML document without an .html extension; saved WordPress
  page with inline styles, worksheet markup, controls, and exercise suggestions.
- skrift.js: plain JavaScript worksheet behavior.
- style.css: WordPress theme CSS, worksheet layout and print styles.
- script.js: generic expandable content and list decorations.
- posts.js: clickable cards and hover arrows.
- taxonomy.js: school-level label styling and link removal.
- 260127SkriftisKrokar.woff2, 260127SkriftisTengd.woff2,
  260127SkriftisPenna.woff2: supplied handwriting font files.

Preserve reference files. Review font/artwork licensing before distributing assets;
we have not verified their licenses. No fonts, scripts, or branding were authored
by this project yet.

## How the original works

- #input-text-area holds input; #btnAddText replaces #note.textContent and clears
  the editor. Newlines are converted to a space followed by a newline.
- #note uses white-space: pre-wrap, allowing explicit line breaks and natural wrap.
  Input is assigned with textContent rather than interpreted as HTML.
- Three font choices: Skriftís Krókar, Skriftís Tengd, Skriftís Penna. Connected
  forms depend on font ligatures/contextual substitutions, enabled through CSS.
- Text sizes and line heights: small 48/68px, medium 68/106px, large 94/140px.
- Defaults: Krókar, large, normal model text, left alignment.
- Forskrift versus Sporun changes text color (dark versus light tracing text),
  not an outline/dotted rendering effect.
- Right-handed setting left-aligns; left-handed setting right-aligns model text.
- Guide lines are separate DOM elements behind text: upper line, middle line,
  baseline, lower line. Fourteen groups are created regardless of text length.
- Upper/lower lines can be hidden together; middle line can be hidden separately.
  The baseline stays visible. Positions and row spacing vary with text size.
- Preview area is fixed at 170mm wide by 254mm high with overflow hidden.
  Extra content is clipped; there is no automatic pagination.
- Windows-specific CSS shifts connected fonts slightly to align with guides.
- Print button calls window.print(). Print CSS hides navigation, settings,
  editor, and footer; requests A4 portrait and removes worksheet border.
- Exercise ideas open a sliding side panel with predefined example words and
  accordions. Recreating this feature has not been explicitly requested.
- Worksheet code has no persistence, backend submission, or database.
- Event registration assumes certain default radio buttons are checked; new
  implementation should initialize robustly from current/persisted state.

## Local-copy limitations

Saved HTML still links to original remote styles/scripts/fonts/images plus
Bootstrap resources and WordPress plugins. CSS font URLs do not match the flat
local font filenames. Do not assume the downloaded page works offline.
The core worksheet behavior can be implemented with local HTML/CSS/JavaScript;
WordPress is not necessary. No browser verification has been performed yet.

## Suggested next implementation steps (not decisions)

1. Inspect current files and Git status before editing; preserve user changes.
2. Choose a small understandable local stack and define formatting helper syntax.
3. Build live editor + worksheet preview using locally served font assets.
4. Persist editor content and preferably settings, with safe restoration.
5. Define overflow/pagination behavior and align preview with printed output.
6. Verify Icelandic text, connected fonts, explicit breaks, natural wrapping,
   persistence after reload, guide alignment, and A4 print/PDF output.

## Open design questions

- Helper syntax: actual Enter/newlines, explicit tokens, blank-row commands,
  page breaks, repeated practice rows, and whether commands should be escaped.
- One worksheet only versus automatic multiple-page generation.
- Exact appearance, worksheet margins, sizes, and whether to keep original presets.
- Whether persistence is browser-only or should follow teachers across devices.
- Whether exercise suggestions or other original-site features are needed.
- Hosting target and deployment method (not yet selected or authorized).

## Repository and collaboration

Repository root: /home/kjartan/Kjartan/skrift.
No existing Git repository was found before initialization.
Current branch: feature/local-worksheet.
The user authorized a local checkpoint commit before closing the chat.
No remote, push or deployment is authorized. Keep secrets out of Git.
Source changes should remain reviewable and use an isolated branch when practical.
Ask before pushing or deploying. Consult the user's supplied collaboration
instructions; this file is project context, not blanket infrastructure permission.


## Implementation status — 2026-10-20

- app/index.html, style.css, app.js implement a dependency-free local static app.
- Live preview updates on input; editor is never cleared by preview updates.
- localStorage key `skrift.worksheet.v1` stores text and validated settings.
  Persistence is per browser/origin; storage errors are shown in the editor.
- Fonts load from preserved mms/ files. No remote assets or external libraries.
- Enter and `{br}` start a row; `{blank}` reserves a blank practice row;
  `{page}` starts a page. Backslash escapes tokens. Unknown tokens stay literal.
- DOM text measurement uses the selected font and shaping features for wrapping;
  oversized words split on grapheme boundaries when Intl.Segmenter is available.
- Multiple A4 pages, 20mm margins, original size presets and line positions.
  Same DOM is used for scaled responsive preview and physical-size printing.
- Typography, model/tracing mode, alignment and guide controls are implemented.
- No exercise panel or shared/account-backed persistence in this iteration.
- README.md gives the loopback-only Python server command and print settings.
- `gjs tests/check.js` passed 19 parser/application checks using DOM doubles.
  Covers Icelandic text, newline variants, escape handling, literal HTML,
  persistence/restoration, blank/page tokens, automatic pagination and print action.
- Application syntax, HTML asset references, WOFF2 headers and local HTTP requests
  passed. Test HTTP server was stopped afterward.
- Real browser QA remains outstanding. Node is absent; Firefox is a snap launcher
  without the actual browser installed, and no browser automation is available.
  DOM doubles do not verify font geometry, guide alignment, print pagination,
  responsive appearance or actual browser localStorage behavior.
- Local checkpoint commit authorized at session close; no deployment, push or
  persistent server was performed.
- Updated user instructions point to ~/.codex/context/UPDATES.md, read during this
  implementation. Its worksheet-project/PROJECT-HANDOFF.md reference was not found
  in this workspace; this PROJECT.md and the current conversation guide this work.


## Resume after closing the chat

1. Read this file and README.md; inspect `git status` and recent commits.
2. Run `python3 -m http.server 8000 --bind 127.0.0.1` from the repository root,
   then open http://127.0.0.1:8000/app/ to try the app. Ctrl+C stops the server.
3. First remaining task: real-browser visual testing of all fonts, wrapping,
   guide alignment, mobile layout, saved text after reload, and A4 print/PDF.
4. Changes and references are saved locally in Git. No remote backup exists.
   Teacher-entered text lives in browser localStorage, outside the repository;
   retain the same browser and origin (including port) to restore it.
5. Do not deploy, publish or push without the user's instruction.
