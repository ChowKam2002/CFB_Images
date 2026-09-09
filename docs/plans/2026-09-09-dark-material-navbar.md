# Dark Material Restyle + Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing feedback-visualization site to a dark, Material-inspired theme with a navbar (logo + title), and add three animations: image cross-fade on dropdown change, hover/focus micro-interactions, and a staggered page-load entrance.

**Architecture:** Pure CSS + a small JS change, no new dependencies. `index.html`'s old `<header><h1><hr>` block becomes a `<nav class="navbar">` containing an inline SVG logo and the title. `styles.css` is fully rewritten with CSS custom properties for the dark palette (`--bg`, `--surface`, `--border`, `--text`, `--text-secondary`, `--accent`), `@keyframes fade-slide-in` for entrance animation, hover/focus transitions on interactive elements, and a `prefers-reduced-motion` guard. `scripts.js`'s `updateImage()` function is the only JS change — it now fades the image out, swaps `src`, and fades back in on load, instead of swapping `src` instantly.

**Tech Stack:** HTML5, CSS3 (custom properties, `@keyframes`, `prefers-reduced-motion`), vanilla JavaScript (ES6). No dependencies. Builds on the already-shipped static site (see `docs/superpowers/specs/2026-09-09-cfb-visualization-site-design.md` and `docs/superpowers/specs/2026-09-09-dark-material-navbar-design.md`).

**Verification approach:** No test framework in this repo (by design). Verification is manual, via a real browser against the actual files (`claude-in-chrome` MCP tools). Since the page is opened via `file://` in production and the browser automation tool cannot navigate to `file://` URLs, verification uses a temporary local HTTP server (`python3 -m http.server`, killed after verification) serving the same files unmodified — this is a testing method only, not a deployment change.

---

### Task 1: Replace header with navbar in `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the `<header>`/`<hr>` block**

Replace this block (currently lines 10-13):
```html
  <header>
    <h1>Current Feedback Response Visualization</h1>
  </header>
  <hr>
```

with:
```html
  <nav class="navbar">
    <svg class="logo" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 16 L8 10 L12 14 L21 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="21" cy="4" r="2" fill="currentColor"/>
    </svg>
    <span class="navbar-title">Current Feedback Response Visualization</span>
  </nav>
```

The full file after this change must read exactly:

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
  <nav class="navbar">
    <svg class="logo" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 16 L8 10 L12 14 L21 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="21" cy="4" r="2" fill="currentColor"/>
    </svg>
    <span class="navbar-title">Current Feedback Response Visualization</span>
  </nav>
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

Nothing else in the file changes — `<main>`, `.controls`, `.viewer`, `<footer>`, and the `<script>` tag stay exactly as they are today.

- [ ] **Step 2: Commit**

```bash
cd /Users/ustropics/Documents/kam/CFB_Images
git add index.html
git commit -m "Replace header with navbar (logo + title)"
```

---

### Task 2: Rewrite `styles.css` for dark Material theme + animations

**Files:**
- Modify: `styles.css` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `styles.css`**

```css
:root {
  --bg: #0e0e0e;
  --surface: #161818;
  --border: #262626;
  --text: #f2f2f2;
  --text-secondary: #aaaaaa;
  --accent: #26a69a;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--text);
  background: var(--bg);
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.25rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  animation: fade-slide-in 400ms ease both;
}

.logo {
  color: var(--accent);
  flex-shrink: 0;
}

.navbar-title {
  font-size: 1.1rem;
  font-weight: 600;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: fade-slide-in 400ms ease 100ms both;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.control select {
  padding: 0.5rem 0.6rem;
  font-size: 1rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

.control select:hover {
  background-color: #1d2020;
}

.control select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent);
}

.viewer {
  display: flex;
  justify-content: center;
  animation: fade-slide-in 400ms ease 200ms both;
}

.viewer img {
  width: 100%;
  max-width: 640px;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: opacity 150ms ease;
}

.viewer img.fading {
  opacity: 0;
}

footer {
  text-align: center;
  padding: 1.5rem 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

footer a {
  color: var(--accent);
  transition: color 150ms ease;
}

footer a:hover {
  color: #64d8cb;
}

@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

This is a full replacement — no rules from the old (light-theme) `styles.css` are kept. In particular, the old `header`, `header h1`, and `hr` selectors are gone entirely (there is no `<header>` or `<hr>` in the HTML anymore after Task 1).

- [ ] **Step 2: Commit**

```bash
cd /Users/ustropics/Documents/kam/CFB_Images
git add styles.css
git commit -m "Rewrite styles.css: dark Material theme, navbar styling, animations"
```

---

### Task 3: Add image cross-fade to `scripts.js`

**Files:**
- Modify: `scripts.js:101-107` (the `updateImage` function only)

- [ ] **Step 1: Replace the `updateImage` function**

Replace this (current lines 101-107):
```js
function updateImage() {
  const variable = document.getElementById("variable-select").value;
  const category = document.getElementById("category-select").value;
  const image = document.getElementById("viewer-image");
  image.src = `static/img/nofilt_unbinned/${category}/${variable}.png`;
  image.alt = `${variable} (${category})`;
}
```

with:
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
  setTimeout(swap, 150);
}
```

Nothing else in `scripts.js` changes — `CATEGORIES`, `VARIABLES`, `populateDropdown`, `init`, and the `DOMContentLoaded` listener stay exactly as they are today. The `.fading` CSS class (opacity 0, defined in Task 2) is what makes this a visible cross-fade rather than an instant swap; the 150ms `setTimeout` matches the CSS `transition: opacity 150ms ease` duration on `.viewer img`.

- [ ] **Step 2: Verify the rest of the file is untouched**

```bash
cd /Users/ustropics/Documents/kam/CFB_Images
git diff scripts.js
```
Expected: the diff shows only the `updateImage` function changing (removed 6 lines, added ~11 lines) — `CATEGORIES`, `VARIABLES`, `populateDropdown`, `init`, and the final `document.addEventListener` line show no changes.

- [ ] **Step 3: Commit**

```bash
git add scripts.js
git commit -m "Add image cross-fade animation to updateImage"
```

---

### Task 4: Verify in a real browser

**Files:** none (verification only)

- [ ] **Step 1: Serve the site over a temporary local HTTP server**

The page is opened via `file://` in production, but the `claude-in-chrome` browser automation tool cannot navigate to `file://` URLs (sandbox restriction). Serve the unmodified files over HTTP purely for automated verification:

```bash
cd /Users/ustropics/Documents/kam/CFB_Images
python3 -m http.server 8843 > /tmp/kam_verify_httpserver.log 2>&1 &
sleep 1
curl -sI http://localhost:8843/index.html | head -3
```
Expected: `HTTP/1.0 200 OK`.

- [ ] **Step 2: Open the page and check the dark theme + navbar render**

Using the `claude-in-chrome` MCP tools (load via `ToolSearch` with query `"select:mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__javascript_tool"` if not already loaded), navigate to `http://localhost:8843/index.html`.

Use `javascript_tool` to check computed styles:
```js
const body = getComputedStyle(document.body);
const nav = document.querySelector('.navbar');
const navStyle = getComputedStyle(nav);
JSON.stringify({
  bodyBg: body.backgroundColor,
  navPosition: navStyle.position,
  navBg: navStyle.backgroundColor,
  hasLogo: !!document.querySelector('.navbar .logo'),
  navbarTitleText: document.querySelector('.navbar-title').textContent,
  hasOldHeader: !!document.querySelector('header'),
  hasOldHr: !!document.querySelector('hr'),
})
```
Expected: `bodyBg` is `rgb(14, 14, 14)` (`#0e0e0e`), `navPosition` is `"sticky"`, `navBg` is `rgb(22, 24, 24)` (`#161818`), `hasLogo` is `true`, `navbarTitleText` is `"Current Feedback Response Visualization"`, `hasOldHeader` and `hasOldHr` are both `false`.

- [ ] **Step 3: Check the image cross-fade behavior**

Use `javascript_tool`:
```js
const image = document.getElementById('viewer-image');
const variableSelect = document.getElementById('variable-select');
await new Promise(r => { if (image.complete) r(); else image.onload = r; });
const beforeSrc = image.src;

variableSelect.value = 'VertU';
variableSelect.dispatchEvent(new Event('change'));
const immediatelyAfter = { classList: image.className, opacity: getComputedStyle(image).opacity };

await new Promise(r => setTimeout(r, 250));
const afterFade = { classList: image.className, opacity: getComputedStyle(image).opacity, src: image.src };

JSON.stringify({ beforeSrc, immediatelyAfter, afterFade })
```
Expected: `immediatelyAfter.classList` contains `"fading"` and `immediatelyAfter.opacity` is `"0"`; `afterFade.classList` does NOT contain `"fading"`, `afterFade.opacity` is `"1"`, and `afterFade.src` ends in `VertU.png`.

- [ ] **Step 4: Check reduced-motion guard exists**

Use `javascript_tool`:
```js
const sheet = [...document.styleSheets].find(s => s.href && s.href.includes('styles.css'));
const rules = [...sheet.cssRules].map(r => r.cssText);
const hasReducedMotionGuard = rules.some(r => r.includes('prefers-reduced-motion'));
const hasKeyframes = rules.some(r => r.startsWith('@keyframes fade-slide-in'));
JSON.stringify({ hasReducedMotionGuard, hasKeyframes })
```
Expected: both `true`.

- [ ] **Step 5: Clean up**

```bash
pkill -f "http.server 8843"
```
Close the browser tab via `tabs_close_mcp`.

- [ ] **Step 6: Report result to user**

If all checks pass, report success. If anything fails, fix the relevant file (`index.html`, `styles.css`, or `scripts.js`), re-run the failed check, and commit the fix with an appropriately scoped message before continuing.
