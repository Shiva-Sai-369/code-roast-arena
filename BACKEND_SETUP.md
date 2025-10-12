# Backend Setup Guide - Code Roast Arena

This guide will help you set up the complete backend infrastructure for the Code Roast Arena project using Supabase.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Node.js and npm installed
- Git (for version control)

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create an account
4. Click "New Project"
5. Fill in:
   - **Name**: `code-roast-arena` (or your preferred name)
   - **Database Password**: Choose a strong password and save it
   - **Region**: Select the closest to your location
6. Click "Create new project" and wait for it to provision (~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Configure Environment Variables

1. In your project root directory, create a file named `.env.local`
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-actual-anon-key-here
```

⚠️ **Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

### 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open the file `backend/supabase/schema.sql` from your project
4. Copy the entire contents
5. Paste it into the SQL Editor in Supabase
6. Click "Run" or press Ctrl+Enter
7. You should see "Success. No rows returned" (this is correct)

### 5. Seed Initial Data

1. Still in the SQL Editor, create another new query
2. Open the file `backend/supabase/seed.sql` from your project
3. Copy the entire contents
4. Paste it into the SQL Editor
5. Click "Run"
6. You should see badges created successfully

### 6. Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Make sure **Email** provider is enabled (it should be by default)
3. Optional: Configure email templates under **Email Templates**
4. Optional: Enable additional providers (Google, GitHub, etc.)

### 7. Verify Database Setup

1. Go to **Database** → **Tables** in Supabase
2. You should see the following tables:
   - `users`
   - `roasts`
   - `badges`
   - `user_badges`
   - `roast_likes`
3. Go to **Database** → **Views**
4. You should see:
   - `leaderboard`

### 8. Test the Connection

1. In your project directory, run:
   ```bash
   npm install
   npm run dev
   ```
2. Open your browser to `http://localhost:5173`
3. Try to sign up with a test account
4. If successful, you should be redirected to the main page

### 9. Set Up the Edge Function (For Roast Generation)

The project uses a Supabase Edge Function to generate roasts. You need to set this up:

1. Check if the function exists in `supabase/functions/generate-roast/index.ts`
2. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```
3. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```
4. Deploy the function:
   ```bash
   supabase functions deploy generate-roast
   ```
5. Set any required secrets (API keys for AI services):
   ```bash
   supabase secrets set OPENAI_API_KEY=your-key-here
   ```

## Database Structure Overview

### Tables

- **users**: Extended user profiles with stats (roasts count, points, etc.)
- **roasts**: Stores all generated roasts with code snippets
- **badges**: Achievement badges users can earn
- **user_badges**: Junction table for user achievements
- **roast_likes**: Tracks which users liked which roasts

### Views

- **leaderboard**: Computed view showing user rankings

### Functions

- **handle_new_user()**: Automatically creates user profile on signup
- **update_user_stats_on_roast()**: Updates user stats when roast is created
- **update_roast_likes_count()**: Maintains like counts
- **check_and_award_badges()**: Awards badges based on achievements

### Security (RLS Policies)

All tables have Row Level Security (RLS) enabled:

- Users can view all profiles but only edit their own
- Anyone can view public roasts
- Only authenticated users can create roasts
- Users can only modify/delete their own roasts

## Troubleshooting

### "Invalid Supabase URL or key"

- Double-check your `.env.local` file
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing env variables

### "relation does not exist" error

- You haven't run the schema.sql file yet
- Go back to Step 4 and run the migration

### Authentication not working

- Check that Email provider is enabled in Authentication settings
- Verify your email templates are configured
- Check browser console for specific error messages

### Function invocation fails

- Make sure you've deployed the Edge Function
- Check function logs in Supabase dashboard
- Verify any required API keys are set as secrets

## Next Steps

After completing the setup:

1. Test user registration and login
2. Try generating a roast
3. Check the leaderboard
4. View badges
5. Customize the schema if needed

## Support

If you encounter issues:

- Check Supabase documentation: https://supabase.com/docs
- Review error logs in Supabase dashboard
- Check browser developer console for client-side errors

---

**Note**: The backend is fully integrated and all features require authentication. Users cannot access any features without logging in first.
