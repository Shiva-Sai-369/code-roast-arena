# Quick Start Guide - Code Roast Arena

## 🚀 5-Minute Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Note your Project URL and API Key

### Step 3: Set Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Step 4: Run Database Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy contents from: `backend/supabase/migrations/001_initial_setup.sql`
3. Paste and click "Run"

### Step 5: Start Development Server

```bash
npm run dev
```

### Step 6: Test It Out

1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account
4. Start roasting code! 🔥

## 📚 Important Notes

### TypeScript Errors

You may see TypeScript errors in the backend services files. **This is normal!**
These will resolve automatically once you:

1. Set up the Supabase project
2. Run the database migration
3. Optionally: Generate fresh types using Supabase CLI

To generate fresh types (optional):

```bash
npx supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts
```

### Required Environment Variables

| Variable                        | Description               | Where to find          |
| ------------------------------- | ------------------------- | ---------------------- |
| `VITE_SUPABASE_URL`             | Your Supabase project URL | Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key           | Project Settings → API |

### Authentication

- **All routes are protected** except `/auth`
- Users **must sign up/login** to use any features
- No anonymous access allowed

### Edge Function (Optional)

If the roast generation doesn't work, you need to deploy the Edge Function:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy function
supabase functions deploy generate-roast

# Set OpenAI key (if using OpenAI)
supabase secrets set OPENAI_API_KEY=sk-...
```

## 🎯 Features Available

After setup, users can:

- ✅ Sign up and log in
- ✅ Generate AI-powered code roasts
- ✅ Earn points and badges
- ✅ View leaderboard
- ✅ Track their stats
- ✅ Like other users' roasts

## 📖 Full Documentation

- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Detailed backend setup
- [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - What's implemented
- [backend/README.md](./backend/README.md) - Backend architecture

## 🆘 Troubleshooting

### "Invalid Supabase URL or key"

- Check `.env.local` file exists
- Verify no extra spaces in env values
- Restart dev server after changing env

### "relation does not exist"

- You haven't run the SQL migration yet
- Go to Supabase SQL Editor and run `001_initial_setup.sql`

### TypeScript errors in backend services

- This is normal before database setup
- Will auto-resolve after migration
- Or regenerate types with Supabase CLI

### Can't access app features

- This is expected! Users must sign up first
- Create an account on `/auth` page
- All features require authentication

## 🎉 You're Done!

If you can:

1. ✅ Sign up
2. ✅ Log in
3. ✅ Generate a roast
4. ✅ See your stats update

Then everything is working perfectly! 🔥
