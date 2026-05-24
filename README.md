# A-1 Tailor (Static Site)

## Edit Site Content
- Shared data lives in `assets/data/site.json` (nav links, footer info, services, gallery, contact details).
- Shared renderer lives in `assets/js/site.js` (builds navbar/footer and fills pages that have specific placeholders).
- To show an email in the footer/contact panel, set `contact.email` in `assets/data/site.json`.

## Run Locally
Because browsers often block `fetch()` for JSON when opening HTML via `file://`, run a local server.

Examples:
```powershell
# Python (if installed)
python -m http.server 5500

# Then open:
# http://localhost:5500/index.html
```
