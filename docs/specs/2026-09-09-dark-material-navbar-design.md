# Dark Material Restyle + Navbar — Design

## Goal

Restyle the existing feedback-visualization site (`index.html` / `styles.css` / `scripts.js`, built per [`2026-09-09-cfb-visualization-site-design.md`](./2026-09-09-cfb-visualization-site-design.md)) with a Material Design-inspired dark theme, add a navbar with a title and a generated logo mark, and add three specific animations. This is a visual/interaction restyle only — the dropdown/image-viewer data model and behavior from the original design are unchanged.

## Constraints (carried over from the original design)

- Vanilla HTML/CSS/JS only, no framework, no build tooling, no external dependency (no CDN font, no icon library, no Material Web Components) — opened via `file://`.
- `scripts.js` still hardcodes `CATEGORIES`/`VARIABLES`; `populateDropdown()`/`updateImage()` remain the extensibility seams for future tabs.

## Decisions made during brainstorming

- **Material implementation:** hand-written CSS that mimics Material Design (elevation, rounded corners, color system, transitions) — not a Material component library. Chosen to keep zero dependencies.
- **Style direction:** "Minimal Dark" (one of three mocked-up directions, user-selected via visual companion) — near-black surfaces, a single teal accent, thin hairline borders instead of heavy drop shadows. This is the most restrained of the three Material directions shown (vs. a purple-tonal "Material You" look or a classic indigo Material 2 app-bar look).
- **Theme scope:** dark-only. No light/dark toggle — out of scope, not requested.
- **Logo:** a generated inline SVG mark (no image asset, no icon font). Reuses the wave/checkmark glyph shown in the mockup — reads as an upward trend/response line, fitting "feedback response."
- **Animations:** exactly three, user-selected: image cross-fade on dropdown change, hover/focus micro-interactions, and a page-load entrance animation.

## Palette

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#0e0e0e` | page background |
| `--surface` | `#161818` | navbar, dropdown fields, image card |
| `--border` | `#262626` | hairline borders/dividers |
| `--text` | `#f2f2f2` | primary text |
| `--text-secondary` | `#aaaaaa` | labels, footer text |
| `--accent` | `#26a69a` | links, focus rings, hover states, logo stroke |

Defined as CSS custom properties on `:root` so every rule references a token, not a literal hex — keeps the palette in one place if it needs adjusting later.

## Navbar

Replaces the current `index.html` `<header><h1>...</h1></header><hr>` block entirely. New structure:

```html
<nav class="navbar">
  <svg class="logo" ...>...</svg>
  <span class="navbar-title">Current Feedback Response Visualization</span>
</nav>
```

- `position: sticky; top: 0;` dark surface (`--surface`), `border-bottom: 1px solid var(--border)`, so it stays visible while the page (86-option-tall dropdown aside) scrolls.
- Logo: inline `<svg>` (not an `<img>`, no external file) — a simple 24×24 stroke path (upward trending line + dot), stroked in `--accent`, matching the mark already validated in the mockup.
- No `<hr>` needed — the navbar's own bottom border replaces it visually.

## Animations

### 1. Image cross-fade

Current `updateImage()` sets `img.src` synchronously. New behavior:

```js
function updateImage() {
  const variable = document.getElementById("variable-select").value;
  const category = document.getElementById("category-select").value;
  const image = document.getElementById("viewer-image");
  const nextSrc = `static/img/nofilt_unbinned/${category}/${variable}.png`;

  image.classList.add("fading");
  const swap = () => {
    image.src = nextSrc;
    image.alt = `${variable} (${category})`;
  };
  image.addEventListener("load", () => image.classList.remove("fading"), { once: true });
  setTimeout(swap, 150); // matches the CSS fade-out duration below
}
```

CSS:
```css
.viewer img {
  transition: opacity 150ms ease;
}
.viewer img.fading {
  opacity: 0;
}
```

On the very first call (page load), the image has no prior `src`, so the 150ms fade-out delay before setting `src` is harmless (fades from nothing to nothing, then fades in once the first image loads).

### 2. Hover/focus micro-interactions

- `<select>` elements: `transition: border-color 150ms ease, box-shadow 150ms ease;` — on `:hover`, border lightens slightly; on `:focus`, a `box-shadow: 0 0 0 2px var(--accent)` glow appears (replaces the default browser outline with a themed one, still visible for accessibility).
- Footer GitHub link: `transition: color 150ms ease;` — text shifts to a lighter tint of `--accent` on `:hover`.
- Navbar itself has no interactive hover target (title/logo are static), so no hover transition needed there.

### 3. Page-load entrance animation

```css
@keyframes fade-slide-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.navbar        { animation: fade-slide-in 400ms ease both; }
.controls      { animation: fade-slide-in 400ms ease 100ms both; }
.viewer        { animation: fade-slide-in 400ms ease 200ms both; }
```

Staggered by 100ms per section (navbar → controls → viewer) so the page assembles top-to-bottom rather than popping in at once.

Wrapped in a reduced-motion guard so all three animations (entrance, cross-fade, hover transitions) are disabled for users who've asked for less motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Files touched

- **Modify `index.html`** — replace `<header>`/`<h1>`/`<hr>` with `<nav class="navbar">` (logo SVG + title span). No other structural change (controls/viewer/footer markup and ids stay as-is).
- **Modify `styles.css`** — full rewrite: `:root` custom properties, dark palette applied to every existing selector, `.navbar`/`.logo`/`.navbar-title` rules, the cross-fade/`fading` class, hover/focus transitions, `@keyframes fade-slide-in`, reduced-motion guard.
- **Modify `scripts.js`** — `updateImage()` gains the fade-out/swap/fade-in orchestration described above. `populateDropdown()`, `init()`, `CATEGORIES`, `VARIABLES` are unchanged.

## Out of scope

- Light/dark theme toggle.
- Any change to the dropdown data model, the image path scheme, or the future-tab extensibility seams from the original design.
- External fonts, icon libraries, or Material component frameworks.
