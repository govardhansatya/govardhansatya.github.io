# govardhansatya.github.io

Personal portfolio of Govardhan Satya Gadi, an AI engineer working on MCP-based agents, knowledge-graph retrieval and applied research. Live at https://govardhansatya.github.io/.

Plain HTML, CSS and JavaScript with no build step. `hero-orb.js` loads Three.js from a CDN.

## Files

- `index.html`: all content (about, skills, experience, projects, research, education, contact)
- `style.css`, `script.js`, `hero-orb.js`: styling, interactions and the hero animation
- `resume.pdf`: linked from the hero and contact sections; replace the file to update it

## Run locally

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Deploy

Push to `main`; GitHub Pages serves the site.
