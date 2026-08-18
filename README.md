# Employee Management System (EMS)

React (Vite) + Supabase based Employee Management System with Admin and
Employee login.

## Features
- Email/password login via Supabase Auth
- Role-based routing: **admin** → full employee table (add/edit/delete),
  **employee** → own profile view only
- Row Level Security (RLS) enforced in the database, not just the frontend
- Clean dashboard UI (Tailwind CSS v4)

---

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run.
   This creates the `employees` table and RLS policies.
3. Go to **Project Settings → API** and copy:
   - Project URL
   - `anon` public key
4. Create your first admin:
   - **Authentication → Users → Add user** (set email + password).
   - Copy that user's UUID.
   - In SQL Editor, run the `insert into employees (...)` statement at the
     bottom of `supabase-schema.sql`, filling in the UUID and admin details.

> Every employee needs BOTH a Supabase Auth user (for login) AND a row in
> the `employees` table (for profile data + role). When the admin "adds an
> employee" from the app, it only creates the table row — you (or the admin)
> still need to add the matching Auth user from the Supabase dashboard with
> the same email, or set up Supabase's invite-by-email flow later.

---

## 2. Local development

```bash
npm install
cp .env.example .env
# edit .env and paste your Supabase URL + anon key
npm run dev
```

---

## 3. Deploy to Azure Static Web Apps

### Option A — Azure Portal + GitHub (recommended, free tier available)

1. Push this project to a GitHub repository.
2. In [Azure Portal](https://portal.azure.com), create a resource →
   **Static Web App**.
3. Fill in:
   - **Deployment source:** GitHub → sign in → select your repo & branch
   - **Build presets:** React
   - **App location:** `/`
   - **Output location:** `dist`
4. Azure auto-creates a GitHub Actions workflow
   (`.github/workflows/azure-static-web-apps-*.yml`) that builds and deploys
   on every push to main.
5. Add your environment variables so the build can access them:
   - Azure Portal → your Static Web App → **Configuration** → Application
     settings → Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Also add them as **GitHub repo secrets** (Settings → Secrets → Actions)
     with the same names, and reference them as build env vars in the
     generated workflow file's `env:` section under the build step:
     ```yaml
     env:
       VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
       VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
     ```
6. Push a commit — Azure builds and deploys automatically. You'll get a
   `https://<name>.azurestaticapps.net` URL.

### Option B — Azure CLI (manual, no GitHub needed)

```bash
npm run build
npm install -g @azure/static-web-apps-cli
swa deploy ./dist --env production
```
(Requires `az login` and an existing Static Web App resource, or the CLI
will help you create one.)

`staticwebapp.config.json` is already included so client-side routing
(React Router) works correctly on Azure.

---

## 4. Project structure

```
src/
  lib/supabaseClient.js      Supabase client init
  context/AuthContext.jsx    session + role state
  pages/Login.jsx
  pages/AdminDashboard.jsx   employee CRUD table
  pages/EmployeeDashboard.jsx  self-service profile
  components/Shell.jsx       sidebar + layout
  components/EmployeeFormModal.jsx
supabase-schema.sql          run this in Supabase SQL editor
```

## 5. Employee table fields

`full_name, email, phone, department, designation, salary, joining_date, address, role`

Add more fields anytime: alter the table in Supabase, then add matching
inputs in `EmployeeFormModal.jsx`.
