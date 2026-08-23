# Arcade

One repo that *is* the website. Every side project lives in its own folder and
gets its own URL; `index.html` is a generated hub that links them all.

```
arcade/
  index.html        generated — do not hand-edit
  projects.json     the list (title, blurb, icon, tag, date)
  build-index.mjs   projects.json -> index.html
  publish           copy a build in, update the list, commit, push
  500/index.html    a project
  <slug>/index.html another project
```

## One-time setup

```bash
cd ~/Desktop/arcade
git init -b main
gh repo create arcade --public --source=. --push
gh api -X POST repos/{owner}/arcade/pages \
  -f build_type=legacy -f 'source[branch]=main' -f 'source[path]=/'
```

That's it — no Actions workflow, no build config. GitHub Pages serves the
branch root directly, so a static file is live the moment it is pushed.

Site: `https://<user>.github.io/arcade/`

## Publishing a project

```bash
./publish <slug> <source> ["Title"] ["Blurb"] [icon] [tag]
```

`<source>` is either a single `.html` file (copied to `<slug>/index.html`) or a
directory (copied wholesale — it needs its own `index.html`).

```bash
./publish 500 ~/Desktop/500_card_game/dist/500.html \
  "500 Elite" "Partnership 500 vs an exact-solver bot" 🃏 "card game"

./publish clickrun ~/Desktop/clickrun/dist
```

Re-running with the same slug replaces that project and bumps its date. Live in
about 30 seconds.

## Notes

- **Only static files.** Anything needing a server (an API key, a database, a
  backend) does not belong here — it needs a host that runs code.
- **Everything published is public.** A public repo means the source of each
  project is browsable too. Do not publish anything with a secret in it.
- **Custom domain**: add a `CNAME` file containing the domain, point a DNS
  `CNAME` record at `<user>.github.io`, and enable HTTPS in the repo's Pages
  settings.
- **Reordering** is by date — newest first. Edit `updated` in `projects.json`
  and run `node ./build-index.mjs` to pin something to the top.
