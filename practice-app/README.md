# Playwright & Selenium Practice App

A comprehensive, self-contained web application built for practicing **Playwright (TypeScript)** and **Selenium** UI automation, plus **REST API automation**. Runs entirely locally with in-memory mock data — safe to hammer with automated tests repeatedly without crashing.

## 🚀 Quick Start

```powershell
cd practice-app
npm install
npm run build
npm start
```

Then open **http://localhost:3000** in your browser.

For development with auto-rebuild on file changes:
```powershell
npm run dev
```

## 📁 Project Structure

```
practice-app/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express app entry point
│   │   ├── routes/            # auth, users, products, orders, files, misc
│   │   ├── middleware/        # JWT auth middleware
│   │   ├── data/              # In-memory data store (resettable)
│   │   └── types/             # Shared TypeScript interfaces
│   ├── downloads/             # Sample files for download practice
│   ├── uploads/                # Destination for uploaded files
│   └── swagger.yaml           # OpenAPI spec
├── frontend/
│   ├── pages/                 # All practice HTML pages (+ child/ subfolder)
│   ├── css/styles.css
│   └── ts/                    # Page-specific TypeScript logic
├── package.json
├── tsconfig.json              # Backend TS config
└── tsconfig.frontend.json     # Frontend TS config
```

## 🗺️ Sitemap (pages)

| Page | Path | Purpose |
|---|---|---|
| Home | `/pages/index.html` | Sitemap & entry point |
| Forms | `/pages/forms.html` | Every HTML form control, validation states |
| Tables | `/pages/tables.html` | Static/sortable/paginated/expandable/editable/selectable tables |
| Popups | `/pages/popups.html` | Native alert/confirm/prompt, custom modals, nested modals, toasts, context menu |
| iFrames | `/pages/iframes.html` | Single + nested iframes |
| Dynamic Content | `/pages/dynamic.html` | Delays, spinners, skeletons, progress bars, lazy images, infinite scroll, calendars |
| Shadow DOM | `/pages/shadow-dom.html` | Custom web component, canvas, SVG, drag-and-drop, details/summary |
| Locator Playground | `/pages/locators.html` | Dedicated elements for every Playwright locator strategy |
| Files | `/pages/file-upload.html` | Single/multiple/drag-drop upload, file downloads |
| Child Pages | `/pages/child/child-page-1.html` | Multi-level parent → child → grandchild navigation |
| API Playground | `/pages/api-playground.html` | Trigger & inspect REST API calls from the UI |

## 🔌 API Documentation

Full Swagger UI: **http://localhost:3000/api-docs**

Key endpoints:
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/POST/PUT/PATCH/DELETE /api/users`, `/api/products`, `/api/orders`
- `GET /api/misc/status/:code` — get any HTTP status code back
- `GET /api/misc/delay/:ms` / `GET /api/products/slow?delay=` — simulate slow responses
- `GET /api/misc/nested` — complex nested JSON
- `POST /api/misc/echo` — echoes request body
- `POST /api/files/upload`, `POST /api/files/upload-multiple`, `GET /api/files/download/:type`
- `POST /api/admin/reset` — resets all in-memory data to seed state

Default seed users: `admin/Admin@123` (admin role), `bob/User@123`, `carla/User@123`.

## 🧪 Playwright Locator Strategy Coverage

The `locators.html` page has dedicated elements for `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByAltText`, `getByTitle`, and `getByTestId`, including ambiguous/duplicate cases for practicing `.filter()`, `.first()`, `.nth()`, `.last()`.

## 🛡️ Stability

- All data is in-memory and reset via `POST /api/admin/reset` — no database required.
- Global Express error handler + `uncaughtException`/`unhandledRejection` guards prevent crashes.
- Input validation on all API endpoints returns proper 400/401/403/404 errors instead of throwing.

## 🌐 Deploying to a Live Server

This app is a standard Node.js/Express server, deployable to any Node host:

**Render / Railway:**
1. Push this repo to GitHub.
2. Create a new Web Service, set build command `npm install && npm run build`, start command `npm start`.

**VPS with PM2:**
```bash
npm install -g pm2
npm install && npm run build
pm2 start backend/dist/server.js --name practice-app
```

Set the `PORT` environment variable if you need a different port than `3000`.

---

> ## ⭐ EVERYDAY USE: How to Start & Stop the App (No Reinstall Needed)
>
> Once dependencies are installed, you **never need to run `npm install` again** on this machine. Just use these two steps every time:
>
> ### ▶️ To Start
> 1. Open a terminal in the `practice-app` folder.
> 2. Run:
>    ```powershell
>    npm start
>    ```
> 3. Wait for:
>    ```
>    ✅ Playwright Practice App running at http://localhost:3000
>    ```
> 4. Open **Chrome** (or any browser) and go to **http://localhost:3000**
>
> ### ⏹️ To Stop
> - Go back to the terminal running the app and press **`Ctrl + C`**.
> - Once stopped, `http://localhost:3000` will no longer load.
>
> ### 🔁 If you edited any `.ts` file
> Rebuild once before starting again:
> ```powershell
> npm run build
> npm start
> ```
>
> ### ⚠️ Important Note on Live Server / Static Hosting
> - VS Code's **Live Server** extension can only serve static HTML/CSS/JS — it **cannot run the backend** (`server.ts`), so API-dependent features (login, uploads, downloads, API Playground, data reset) **will not work** with Live Server.
> - `http://localhost:3000` **only works while `npm start` is actively running** in a terminal. It is not a permanent public website — closing the terminal (or `Ctrl+C`) stops it immediately.
> - To get a permanent public URL that works **without running anything locally**, the app must be deployed to a hosting provider (see the *Deploying to a Live Server* section above).
>
> ### 🧯 Troubleshooting: `Error: listen EADDRINUSE: address already in use :::3000`
> This means the app (or another process) is **already running** on port 3000. You have two options:
>
> **Option 1 — Just use the already-running instance:**
> Open **http://localhost:3000** directly in your browser — no need to start it again.
>
> **Option 2 — Free the port, then start fresh:**
> ```powershell
> Get-Process -Name node | Stop-Process -Force
> npm start
> ```
>
> ### 🔗 Navigating the App
> - The site root `/` automatically redirects to `/pages/index.html`. If links seem to "not respond," make sure you're viewing the app in a **real browser tab** (Chrome/Edge/Firefox) rather than VS Code's embedded Simple Browser, which can sometimes fail to handle in-page navigation correctly.
> - The **Child Pages** link intentionally opens in a **new browser tab** (`target="_blank"`) to practice multi-tab/multi-window automation with Playwright (`context.waitForEvent('page')`) and Selenium (window handles).
>
> ### 🧹 Resetting Practice Data
> If your test runs have created/modified/deleted a lot of API data (users, products, orders) and you want a clean slate, either:
> - Click the **"Reset Practice Data"** button on the Home page, or
> - Call the endpoint directly:
>   ```powershell
>   Invoke-WebRequest -Uri http://localhost:3000/api/admin/reset -Method POST
>   ```
