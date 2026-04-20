# Rāgaa Academy — Setup Guide

## Prerequisites

- **Node.js** 18+ → [nodejs.org](https://nodejs.org)
- **VS Code** → [code.visualstudio.com](https://code.visualstudio.com)
- **Supabase account** (free) → [supabase.com](https://supabase.com)

---

## Step 1 — Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and click **New Project**
2. Name it `ragaa-academy`, pick a region close to you, set a DB password
3. Wait for the project to finish provisioning (~30 seconds)

## Step 2 — Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Open `supabase/schema.sql` from this project, copy the entire contents
4. Paste into the SQL Editor and click **Run**
5. You should see all tables created under **Table Editor**: profiles, courses, enrollments, class_sessions, class_recordings, notifications, blog_posts

## Step 3 — Get Your API Keys

1. Go to **Settings → API** in your Supabase dashboard
2. Copy these two values:
   - **Project URL** → looks like `https://abcdefg.supabase.co`
   - **anon public key** → the long key under "Project API keys"

## Step 4 — Set Up the Project Locally

Open your terminal in VS Code and run:

```bash
# Navigate to the project folder
cd ragaa

# Create your .env file from the template
cp .env.example .env
```

Now open `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
```

## Step 5 — Install & Run

```bash
npm install
npm run dev
```

The app opens at **http://localhost:3000** 🎉

---

## Step 6 — Enable Google Login (Optional)

1. In Supabase dashboard, go to **Authentication → Providers**
2. Enable **Google**
3. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Create an OAuth 2.0 Client ID (Web application)
5. Set **Authorized redirect URI** to:
   `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret** back into Supabase

---

## Project Structure

```
ragaa/
├── index.html                 # Entry HTML
├── package.json               # Dependencies
├── vite.config.js             # Vite config
├── .env.example               # Environment template
├── .gitignore
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Routes & layout
│   ├── supabase.js            # Supabase client init
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state management
│   ├── components/
│   │   ├── Navbar.jsx         # Nav with auth awareness
│   │   ├── Footer.jsx
│   │   ├── Btn.jsx            # Reusable button
│   │   ├── GoldDivider.jsx    # Decorative divider
│   │   └── SectionTag.jsx     # Section label
│   ├── pages/
│   │   ├── Home.jsx           # Landing page (all sections)
│   │   ├── Login.jsx          # Auth page (signup + signin)
│   │   ├── Dashboard.jsx      # Student portal (recordings, notifications)
│   │   └── PlaceholderPage.jsx
│   └── styles/
│       ├── global.css         # Reset & base styles
│       └── theme.js           # Colors, fonts, WhatsApp config
└── supabase/
    └── schema.sql             # Full DB schema with RLS
```

---

## What's Built

- ✅ Landing page with hero, about, courses, guru, testimonials, CTA
- ✅ Supabase Auth (email/password + Google OAuth)
- ✅ Protected dashboard with recordings, notifications, schedule
- ✅ Session persistence & auto-refresh
- ✅ Row Level Security on all tables
- ✅ WhatsApp redirect for free trial booking
- ✅ Mobile responsive navigation

## What's Next

- [ ] Course catalog page (dynamic from Supabase)
- [ ] Blog / resources page
- [ ] Payment integration (Razorpay)
- [ ] Admin panel for managing students, recordings, notifications
- [ ] Video player for recordings (e.g. Mux or Cloudflare Stream)
- [ ] Email notifications via Supabase Edge Functions
