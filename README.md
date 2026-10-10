# MUHAMMAD KABBO — Portfolio V5

Futuristic responsive developer portfolio with an editable data center and individual Android app detail pages.

## Edit everything from `data.js`
Update profile, skills, statistics, apps, Craftland maps, projects, achievements, social links and release notes.

### Add an APK
Inside an app object, set:
```js
download:'downloads/your-app.apk'
```
or use a verified HTTPS download URL. Until a real APK is added, the site shows **APK NOT ADDED** instead of a broken link.

### Add real screenshots
Replace the placeholder files in `assets/apps/` with real PNG/JPG screenshots, keeping the filenames or changing the paths in `data.js`.

## App detail pages
Each app card opens `app.html?app=0`, `app.html?app=1`, etc. The page includes status, version, update date, feature matrix, screenshot gallery and release notes.

## Hosting
This is a static website and can be hosted on GitHub Pages, Netlify, Cloudflare Pages or similar static hosting.

A future admin panel will require a backend/database for secure editing and APK management.
