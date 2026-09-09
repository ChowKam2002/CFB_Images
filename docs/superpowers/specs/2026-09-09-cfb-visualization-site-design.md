# CFB Feedback Response Visualization — Design

## Goal

A static webpage (`index.html` + `styles.css` + `scripts.js`, no build tooling, no framework) that lets the user browse the pre-generated plots in `static/img/nofilt_unbinned/` via two dropdown menus and a single image viewer.

Page title: "Current Feedback Response Visualization".

## Constraints

- Opened via plain `file://` double-click — no local server. This rules out `fetch()` for a JSON manifest; the list of variables and categories must be hardcoded directly in `scripts.js`.
- No package manager, bundler, or framework. Vanilla HTML/CSS/JS only.
- Build in `CFB_Images/` (the real git repo). The duplicate copy at the top level of `kam/` is out of scope for this work.

## Data

All three category directories under `static/img/nofilt_unbinned/` (`All`, `SPDLo0`, `SPDLo3`) contain the exact same 86 filenames (verified by diff). This means any combination of variable + category is always a valid image path — no cross-filtering logic needed between the two dropdowns.

Image path pattern:
```
static/img/nofilt_unbinned/{category}/{variable}.png
```

`scripts.js` hardcodes two arrays:
```js
const CATEGORIES = ["All", "SPDLo0", "SPDLo3"];
const VARIABLES = [ /* all 86 filenames, sorted, no .png extension */ ];
```

Dropdown option labels are the raw filenames/category names as-is (no relabeling).

## Layout

Matches the provided sketch:

1. **Header** — `<h1>` title, then `<hr>` separating it from the body.
2. **Body**
   - Two `<select>` dropdowns side by side near the top:
     - Tab 1 — Variable Selector (iterates `VARIABLES`)
     - Tab 2 — Condition sub-binning selector (iterates `CATEGORIES`)
   - Image viewer below: a single `<img>` showing `static/img/nofilt_unbinned/{selected category}/{selected variable}.png`. Sized to take up most of the page width while staying taller than wide (portrait, ~4:5 ratio), via CSS `max-width` / `max-height` / `aspect-ratio` on a containing element.
3. **Footer** — small link to `https://github.com/ChowKam2002/CFB_Images`.

## Behavior

- Each dropdown holds its own independent state. Changing one dropdown does not reset or affect the other's selection — since the same 86 filenames exist in every category, every combination is always valid, so this falls out naturally rather than needing special-cased state management.
- Changing either dropdown re-renders the `<img src>` to match the current variable + category.
- Default selection on page load: first entry alphabetically in each dropdown (`Agg` for variable, `All` for category).

## Extensibility (not built now, but shape the code to allow it)

The user expects to add later:
- A third dropdown (tab 3) for filtering presence and/or model run — would iterate *parent* directories of what tab 2 iterates today (i.e., `static/img/{parent}/nofilt_unbinned/...` or similar, structure TBD when it happens).
- A second, separate dropdown-pair + image-viewer section for 1D/2D transects, distinct from this one.

Neither is built now (YAGNI) — this design only requires that the dropdown wiring and image-path construction live in a small number of clearly named functions/config in `scripts.js`, rather than being inlined ad hoc, so a future tab can be added by extending the config rather than rewriting the page.

## Out of scope

- Syncing changes to the duplicate copy at the top level of `kam/`.
- Any image processing, filtering, or generation — the PNGs already exist and are treated as static assets.
- 1D/2D transect viewer (future work, mentioned above for context only).
