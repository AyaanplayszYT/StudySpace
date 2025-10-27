# StudySpace

## Project info

**URL**: https://github.com/AyaanplayszYT/StudySpace

## Installation

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/AyaanplayszYT/StudySpace

# Step 2: Navigate to the project directory.
cd StudySpace

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Supabase Setup (SQL)

1. Go to your Supabase project > SQL Editor.
2. Run the following SQL to create tables and storage:

```sql
-- Notes table
CREATE TABLE notes (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	title text NOT NULL,
	description text,
	date date,
	file_url text,
	created_at timestamp with time zone DEFAULT now()
);

-- Tasks table
CREATE TABLE tasks (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	title text NOT NULL,
	description text,
	deadline date,
	created_at timestamp with time zone DEFAULT now()
);

-- Storage bucket for files
-- In Supabase dashboard: Storage > Create bucket (e.g., 'files')

-- Row Level Security (RLS)
-- Enable RLS for notes and tasks tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Public select policy
CREATE POLICY "Public can view notes" ON notes
	FOR SELECT USING (true);
CREATE POLICY "Public can view tasks" ON tasks
	FOR SELECT USING (true);

-- Admin insert/delete policy (replace 'admin_password' with your password logic)
-- For static hosting, posting/deletion is gated in frontend by password only

-- Storage bucket policy (public read)
-- In Supabase dashboard: Storage > files > Settings > Public bucket
```
# ADMIN PASS
Classroom2025

## Static Hosting Instructions

1. Build your app:
	 ```sh
	 npm run build
	 ```
2. Deploy the `dist/` folder to Netlify, Vercel, GitHub Pages, or any static host.
3. All routes work via hash-based routing (`/#/admin`, `/#/dashboard`). No server rewrites needed.

## Environment Variables

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
## How can I deploy this project?

### Vercel
1. Connect your GitHub repository to Vercel (Import Project → select repo).
2. Set Build Command: `npm run build` and Output Directory: `dist`.
3. Add environment variables under Project Settings → Environment Variables:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
4. Deploy: Vercel will auto-deploy on pushes. Hash-based routing (/#/...) works without extra rules.

### Netlify
1. In Netlify, click "New site from Git" and connect your repo.
2. Configure Build Command: `npm run build` and Publish directory: `dist`.
3. Add env vars at Site settings → Build & deploy → Environment → Environment variables:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
4. Alternatively, use drag-and-drop to upload the `dist/` folder after running `npm run build` locally. No rewrites required for hash routing.

### Render
1. In Render dashboard, create a new "Static Site" and connect your repo.
2. Set the Branch to deploy, Build Command: `npm run build`, and Publish Directory: `dist`.
3. Add environment variables in the Static Site settings:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
4. Render will build and deploy on each push. Hash-based routing works without special configuration.

Notes:
- Always confirm the published folder is `dist` (Vite default).  
- Keep your Supabase keys secret; use each platform's environment variable settings (do not commit them to the repo).
- For previews, use the provider’s preview/deploy-from-branch features.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


<img width="1906" height="861" alt="image" src="https://github.com/user-attachments/assets/33b3ee92-430e-4a38-8dbe-9defe33e7b35" />



