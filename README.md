# Polyaymen — 3D Artist Portfolio

An interactive portfolio where every project can be inspected as a live, orbit-able 3D model directly on the page (no external Sketchfab embed) — plus a private dashboard for uploading and managing new work.

## Stack

- **Backend:** Django + Django REST Framework, JWT auth, Supabase Postgres
- **Frontend:** React (Vite), `react-three-fiber` + `drei` for the 3D viewer, React Router, Zustand, Framer Motion
- **3D format:** GLB (self-contained mesh + materials + textures). Compress with Draco/Meshopt before uploading for fast load times.

## Project structure

```
backend/
  config/                 # Django settings, urls
  apps/
    accounts/              # JWT login (owner-only, no public signup)
    portfolio/              # Project, Category, Tool, ProjectImage models + API
    profile_info/           # Singleton ArtistProfile (bio, socials, resume)
    contact/                 # Contact form endpoint + inbox
  frontend/
    src/
      theme/                  # design tokens (tokens.css) + component styles
      components/              # ModelViewer, ProjectCard, Nav, Footer
      pages/                    # Home, ProjectDetail, About, Contact
      pages/dashboard/           # Login, project list/form, inbox
      api/client.js               # axios instance + all API calls
      store/authStore.js           # JWT session state (Zustand)
```

## Running locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in DATABASE_URL with your Supabase connection string
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API is now live at `http://127.0.0.1:8000/api/`. Django admin at `/admin/` (handy as a secondary way to manage content besides the React dashboard).

### Frontend

```bash
cd backend/frontend
npm install
npm run dev
```

Site is now live at `http://127.0.0.1:5173`. It talks to the backend at `http://127.0.0.1:8000/api` by default — override with a `.env` file containing `VITE_API_BASE=...` if needed.

## Adding your first project

1. Go to `http://127.0.0.1:5173/dashboard/login` and sign in with your superuser credentials.
2. Click **New Project**, fill in the details, upload a thumbnail (required) and a `.glb` file (optional — projects without one fall back to a gallery of static renders).
3. Check **Featured** to have it appear rotating in the homepage hero.
4. Save — it's live on the public site immediately if **Published** is checked.

You can also manage everything from Django admin at `/admin/`, including the bio/socials singleton and reordering projects.

## Key design decisions

- **GLB-only for 3D:** keeps the pipeline simple — one file per model, no separate texture uploads to keep track of. Export from Blender/Maya/ZBrush with textures embedded.
- **Hover-preview on cards:** project grid cards show a static thumbnail by default and cross-fade into a live rotating 3D preview on hover — this is the signature interaction, distinct from a plain thumbnail grid or a bolted-on embed.
- **JWT, single-owner auth:** there's intentionally no public registration flow — this is a one-person studio's dashboard, not a multi-tenant app.
- **App-per-concern on the backend:** `portfolio`, `profile_info`, `contact`, and `accounts` are separate Django apps specifically so you can add or remove functionality (e.g. a blog app, a shop app) later without entangling models.

## Next steps / not yet wired up

- **Category/Tool pickers in the dashboard form** — currently the write API supports `category` and `tools`, but the React form doesn't yet expose selectors for them (quick addition: fetch `/api/categories/` and `/api/tools/`, render as a `<select>`/multi-select).
- **Gallery image upload UI** — the model supports multiple fallback images per project (`ProjectImage`), manageable today via Django admin; a dedicated multi-upload widget in the React dashboard is the natural next addition.
- **Production file storage** — `django-storages` is installed and ready; point it at S3/Cloudflare R2 via env vars when you deploy, since local disk storage won't survive most hosting platforms' redeploys.
- **Code-splitting the 3D viewer bundle** — Three.js pushes the JS bundle past 500kb; lazy-load `ModelViewer` with `React.lazy()` if initial page load time matters a lot to you.
