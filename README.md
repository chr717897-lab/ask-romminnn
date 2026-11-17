# ASK ROMAN — setup guide

A modern personal Q&A website with named questions, a private admin inbox, and public answers.

## What you need
- A free Supabase account (database + admin login)
- A free Vercel account (website hosting)
- A GitHub account (to import the project)

## 1. Create the database
1. Open https://supabase.com and create a new project.
2. Open **SQL Editor** in your Supabase project.
3. Open `supabase/schema.sql` from this project, copy all of it, paste it into SQL Editor and click **Run**.
4. In Supabase, open **Project Settings → API**. Copy the Project URL and the `anon` / publishable public key.

## 2. Create your admin login
1. In Supabase, open **Authentication → Users**.
2. Choose **Add user** and create your own email + password.
3. Turn off public sign-ups in **Authentication → Settings**. Do not create accounts for visitors.
4. Keep your admin password private. The admin page is at `/admin`.

The SQL policies are designed for one private admin account. Do not enable public sign-ups: authenticated users have management access.

## 3. Add the website settings
1. Rename `.env.example` to `.env.local`.
2. Add your Supabase Project URL and anon/public key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Never put a `service_role` key in this website or in any `NEXT_PUBLIC_` variable.

## 4. Run it on your computer
Install Node.js 20 or newer from https://nodejs.org.
In this folder, open Terminal and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to see the public page.
Open http://localhost:3000/admin to sign in and manage questions.

## 5. Put it online
1. Create a GitHub repository and upload all project files (do not upload `.env.local`).
2. Go to https://vercel.com, sign in and import that GitHub repository.
3. In Vercel project **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Vercel will give you a public URL.
5. Test sending a question, then sign in at `your-domain.vercel.app/admin`, write an answer and publish it.
6. Add the public URL to your Instagram bio.

## How publishing works
- Visitors enter their name and question.
- New questions are private and only visible in your admin inbox.
- You write an answer and choose **Publish answer**.
- Only published questions with answers appear on the public page.
- You can update, unpublish or delete a question from the dashboard.

## Before sharing widely
- Test with a question you submit yourself.
- Do not publish private information or identifying details about visitors without their permission.
- This starter does not include CAPTCHA or advanced spam/rate limiting. If spam becomes a problem, add CAPTCHA and server-side rate limiting before promoting the link widely.
- Add your own domain later if you want (for example, askroman.com, if available).

## Troubleshooting
- **Environment variables missing:** check `.env.local`, then restart `npm run dev`.
- **Questions won't submit:** check that `schema.sql` ran successfully and the Supabase URL/key are correct.
- **Admin can't see pending questions:** confirm you are signed in with the user created in Supabase and public sign-ups are disabled.
- **Deployment changes not showing:** redeploy after changing environment variables.
