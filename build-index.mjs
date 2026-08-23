#!/usr/bin/env node
/* Regenerate index.html from projects.json. Zero dependencies, no build step —
   `./publish` calls this for you, but running it by hand is fine too. */
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const projects = JSON.parse(fs.readFileSync(path.join(here, 'projects.json'), 'utf8'));
const esc = s => String(s == null ? '' : s)
  .replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const fmt = iso => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${MON[m - 1]} ${d}, ${y}`;
};

// Newest first, so the thing you just shipped is the thing people see.
const sorted = [...projects].sort((a, b) => String(b.updated).localeCompare(String(a.updated)));

const cards = sorted.map(p => `      <a class="card" href="./${esc(p.slug)}/">
        <span class="icon" aria-hidden="true">${esc(p.icon || '✦')}</span>
        <span class="body">
          <span class="title">${esc(p.title)}</span>
          <span class="blurb">${esc(p.blurb)}</span>
        </span>
        <span class="meta">
          ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}
          <span class="date">${esc(fmt(p.updated))}</span>
        </span>
      </a>`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Arcade</title>
<meta name="description" content="Side projects, playable.">
<meta name="color-scheme" content="dark">
<meta property="og:title" content="Arcade">
<meta property="og:description" content="Side projects, playable.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='26' font-size='26'%3E%F0%9F%95%B9%EF%B8%8F%3C/text%3E%3C/svg%3E">
<style>
  :root {
    --bg: #0c1210;
    --panel: #101a16;
    --edge: #263830;
    --ivory: #f2ede2;
    --linen: #d8d2c4;
    --dim: #7e8a80;
    --brass: #c9a557;
    --serif: 'Palatino', 'Palatino Linotype', 'Book Antiqua', Georgia, 'Times New Roman', serif;
    --sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; }
  body {
    min-height: 100dvh;
    background:
      radial-gradient(120% 80% at 50% 0%, #16231d 0%, var(--bg) 65%),
      var(--bg);
    color: var(--linen);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
    padding: 0 20px 64px;
  }
  main { max-width: 720px; margin: 0 auto; }
  header { padding: 72px 0 8px; text-align: center; }
  .wordmark {
    font-family: var(--serif);
    font-size: clamp(38px, 11vw, 60px);
    letter-spacing: 0.16em;
    color: var(--brass);
    margin: 0;
    font-weight: 400;
    text-shadow: 0 0 34px rgba(201, 165, 87, 0.22);
  }
  .rule {
    width: 92px; height: 1px; margin: 18px auto 16px;
    background: linear-gradient(90deg, transparent, var(--brass), transparent);
    opacity: 0.7;
  }
  .sub {
    font-size: 13.5px; letter-spacing: 0.06em; color: var(--dim);
    text-transform: uppercase; margin: 0;
  }
  .grid { display: grid; gap: 12px; margin-top: 40px; }
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'icon body' 'meta meta';
    gap: 4px 16px;
    align-items: start;
    padding: 18px 20px;
    border: 1px solid var(--edge);
    border-radius: 14px;
    background: linear-gradient(170deg, #131f1a, var(--panel));
    text-decoration: none;
    color: inherit;
    transition: border-color 0.18s, transform 0.18s, box-shadow 0.18s;
  }
  .card:hover, .card:focus-visible {
    border-color: rgba(201, 165, 87, 0.55);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
    outline: none;
  }
  .card:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; }
  .icon { grid-area: icon; font-size: 30px; line-height: 1.1; }
  .body { grid-area: body; display: block; }
  .title {
    display: block;
    font-family: var(--serif);
    font-size: 21px;
    color: var(--ivory);
    margin-bottom: 5px;
  }
  .blurb { display: block; font-size: 14px; line-height: 1.5; color: var(--dim); }
  .meta {
    grid-area: meta;
    display: flex; align-items: center; gap: 10px;
    margin-top: 12px; padding-left: 46px;
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .tag {
    border: 1px solid rgba(201, 165, 87, 0.35);
    color: var(--brass);
    border-radius: 999px;
    padding: 3px 9px;
  }
  .date { color: #5d6a61; }
  .empty {
    border: 1px dashed var(--edge); border-radius: 14px;
    padding: 34px 20px; text-align: center; color: var(--dim); font-size: 14px;
  }
  footer {
    margin-top: 56px; text-align: center;
    font-size: 12px; color: #4d5a51; letter-spacing: 0.05em;
  }
  @media (max-width: 420px) {
    header { padding-top: 52px; }
    .card { padding: 16px; gap: 4px 13px; }
    .meta { padding-left: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .card { transition: border-color 0.18s; }
    .card:hover, .card:focus-visible { transform: none; }
  }
</style>
</head>
<body>
<main>
  <header>
    <h1 class="wordmark">ARCADE</h1>
    <div class="rule"></div>
    <p class="sub">Side projects, playable</p>
  </header>

  <div class="grid">
${cards || '      <div class="empty">Nothing published yet — run <code>./publish</code>.</div>'}
  </div>

  <footer>Built by hand · no trackers · no cookies</footer>
</main>
</body>
</html>
`;

fs.writeFileSync(path.join(here, 'index.html'), html);
console.log(`index.html rebuilt — ${sorted.length} project${sorted.length === 1 ? '' : 's'}`);
