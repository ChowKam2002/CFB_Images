# CFB Feedback Response Visualization Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static webpage (`index.html` + `styles.css` + `scripts.js`) in `CFB_Images/` that lets the user pick a variable and a sub-binning category from two dropdowns and view the matching plot from `static/img/nofilt_unbinned/{category}/{variable}.png`.

**Architecture:** Pure vanilla HTML/CSS/JS, no build step, no framework. `scripts.js` hardcodes the list of 86 variable names and 3 categories (required because the page is opened via `file://`, which blocks `fetch()` of a JSON manifest), populates two `<select>` elements from those arrays via a small reusable `populateDropdown()` function, and updates a single `<img>`'s `src` on any `change` event via `updateImage()`. There is no cross-filtering between dropdowns — every variable exists in every category, so each dropdown's state is independent and native `<select>` behavior is sufficient.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES6). No dependencies, no package manager, no test framework — this project has none installed and none should be added (see `docs/superpowers/specs/2026-09-09-cfb-visualization-site-design.md`).

**Verification approach:** Since there is no test framework in this repo (by design — it's a `file://`-hosted static page), verification is done by opening `index.html` in a real browser via the `claude-in-chrome` MCP tools and checking the rendered DOM/behavior, rather than by unit tests.

---

### Task 1: Build `index.html`

**Files:**
- Modify: `index.html` (currently a single blank line)

- [ ] **Step 1: Replace the contents of `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Current Feedback Response Visualization</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Current Feedback Response Visualization</h1>
  </header>
  <hr>
  <main>
    <div class="controls">
      <div class="control">
        <label for="variable-select">Variable Selector</label>
        <select id="variable-select"></select>
      </div>
      <div class="control">
        <label for="category-select">Condition Sub-Binning Selector</label>
        <select id="category-select"></select>
      </div>
    </div>
    <div class="viewer">
      <img id="viewer-image" alt="Selected plot">
    </div>
  </main>
  <footer>
    <a href="https://github.com/ChowKam2002/CFB_Images" target="_blank" rel="noopener">GitHub Repository</a>
  </footer>
  <script src="scripts.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
cd /Users/ustropics/Documents/kam/CFB_Images
git add index.html
git commit -m "Add index.html skeleton for feedback visualization site"
```

---

### Task 2: Build `styles.css`

**Files:**
- Modify: `styles.css` (currently a single blank line)

- [ ] **Step 1: Replace the contents of `styles.css`**

```css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: #1a1a1a;
  background: #fafafa;
}

header {
  padding: 1.5rem 1rem 1rem;
  text-align: center;
}

header h1 {
  margin: 0;
  font-size: 1.75rem;
}

hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 0;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.controls {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control label {
  font-size: 0.85rem;
  font-weight: 600;
}

.control select {
  padding: 0.4rem;
  font-size: 1rem;
}

.viewer {
  display: flex;
  justify-content: center;
}

.viewer img {
  width: 100%;
  max-width: 640px;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  background: #fff;
  border: 1px solid #ddd;
}

footer {
  text-align: center;
  padding: 1.5rem 1rem;
  font-size: 0.85rem;
}

footer a {
  color: #555;
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/ustropics/Documents/kam/CFB_Images
git add styles.css
git commit -m "Add styles.css layout for feedback visualization site"
```

---

### Task 3: Build `scripts.js`

**Files:**
- Modify: `scripts.js` (currently a single blank line)

- [ ] **Step 1: Replace the contents of `scripts.js`**

```js
const CATEGORIES = ["All", "SPDLo0", "SPDLo3"];

const VARIABLES = [
  "Agg",
  "Counts",
  "DAgg",
  "DFlux",
  "DSST",
  "DVec",
  "Flux",
  "SST",
  "Vec",
  "VertDef1",
  "VertDef2",
  "VertDiv",
  "VertMixLen",
  "VertMixr",
  "VertMixrhdiff",
  "VertMixri",
  "VertMixrl",
  "VertMixrtend",
  "VertMixrvdiff",
  "VertPres",
  "VertPreslap",
  "VertPresx",
  "VertPresy",
  "VertQKE",
  "VertTpot",
  "VertTpothdiff",
  "VertTpotlap",
  "VertTpottend",
  "VertTpotvdiff",
  "VertTpotx",
  "VertTpoty",
  "VertU",
  "VertUadvMixr",
  "VertUadvTpot",
  "VertUadvU",
  "VertUadvV",
  "VertUadvW",
  "VertUageo",
  "VertUgeo",
  "VertUhdiff",
  "VertUtend",
  "VertUvdiff",
  "VertV",
  "VertVadvMixr",
  "VertVadvTpot",
  "VertVadvU",
  "VertVadvV",
  "VertVadvW",
  "VertVageo",
  "VertVgeo",
  "VertVhdiff",
  "VertVort",
  "VertVtend",
  "VertVvdiff",
  "VertW",
  "VertWadvMixr",
  "VertWadvTpot",
  "VertWadvU",
  "VertWadvV",
  "VertWadvW",
  "VertWhdiff",
  "VertWtend",
  "VertWvdiff",
  "VertadvMixr",
  "VertadvTpot",
  "VertadvU",
  "VertadvV",
  "VertadvW",
  "VerthadvMixr",
  "VerthadvTpot",
  "VerthadvU",
  "VerthadvV",
  "VerthadvW",
  "VertnoAdvTpottend",
  "VertnoadvMixrtend",
  "VertnoadvUtend",
  "VertnoadvVtend",
  "VertnoadvWtend",
  "VertxCor",
  "VertxCorrageo",
  "VertxPGF",
  "VertyCor",
  "VertyCorrageo",
  "VertyPGF",
  "VertzCor",
  "VertzPGF"
];

function populateDropdown(selectEl, items) {
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectEl.appendChild(option);
  }
}

function updateImage() {
  const variable = document.getElementById("variable-select").value;
  const category = document.getElementById("category-select").value;
  const image = document.getElementById("viewer-image");
  image.src = `static/img/nofilt_unbinned/${category}/${variable}.png`;
  image.alt = `${variable} (${category})`;
}

function init() {
  const variableSelect = document.getElementById("variable-select");
  const categorySelect = document.getElementById("category-select");

  populateDropdown(variableSelect, VARIABLES);
  populateDropdown(categorySelect, CATEGORIES);

  variableSelect.addEventListener("change", updateImage);
  categorySelect.addEventListener("change", updateImage);

  updateImage();
}

document.addEventListener("DOMContentLoaded", init);
```

**Important:** The `VARIABLES` array above must contain exactly these 86 entries, matching the actual filenames (minus `.png`) in `static/img/nofilt_unbinned/All/`, `SPDLo0/`, and `SPDLo3/` — these three directories are already confirmed (via `diff`) to contain identical filename sets. Do not hand-retype this list; copy it verbatim from this plan.

- [ ] **Step 2: Verify the array matches the filesystem**

Run:
```bash
cd /Users/ustropics/Documents/kam/CFB_Images/static/img/nofilt_unbinned/All
python3 -c "
import os, json, re
with open('/Users/ustropics/Documents/kam/CFB_Images/scripts.js') as f:
    src = f.read()
match = re.search(r'const VARIABLES = (\[[\s\S]*?\]);', src)
js_vars = sorted(json.loads(match.group(1)))
fs_vars = sorted(f[:-4] for f in os.listdir('.') if f.endswith('.png'))
assert js_vars == fs_vars, (set(js_vars) ^ set(fs_vars))
print('OK:', len(js_vars), 'variables match')
"
```
Expected: `OK: 86 variables match`

- [ ] **Step 3: Commit**

```bash
cd /Users/ustropics/Documents/kam/CFB_Images
git add scripts.js
git commit -m "Add scripts.js dropdown wiring for feedback visualization site"
```

---

### Task 4: Verify in a real browser

**Files:** none (verification only)

- [ ] **Step 1: Open the page**

Using the `claude-in-chrome` MCP tools (load them first via `ToolSearch` with query `"select:mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__computer"` if not already loaded), open:

```
file:///Users/ustropics/Documents/kam/CFB_Images/index.html
```

- [ ] **Step 2: Check initial render**

Use `read_page` (or `get_page_text`) to confirm:
- The `<h1>` reads "Current Feedback Response Visualization"
- `#variable-select` has 86 `<option>` elements, first one `value="Agg"`
- `#category-select` has 3 `<option>` elements: `All`, `SPDLo0`, `SPDLo3`
- `#viewer-image` has `src` ending in `static/img/nofilt_unbinned/All/Agg.png` and the image actually loads (not a broken-image icon)

- [ ] **Step 3: Check dropdown independence**

Using `computer`, select a different value in `#variable-select` (e.g. `VertU`) and confirm via `read_page` that:
- `#viewer-image` src becomes `.../All/VertU.png`
- `#category-select` is still `All` (unchanged)

Then select `SPDLo3` in `#category-select` and confirm:
- `#viewer-image` src becomes `.../SPDLo3/VertU.png`
- `#variable-select` is still `VertU` (unchanged)

- [ ] **Step 4: Check footer link**

Confirm the footer contains a link with `href="https://github.com/ChowKam2002/CFB_Images"`.

- [ ] **Step 5: Report result to user**

If all checks pass, report success. If anything fails, fix the relevant file (`index.html`, `styles.css`, or `scripts.js`), re-run the failed check, and commit the fix with an appropriately scoped message before continuing.
