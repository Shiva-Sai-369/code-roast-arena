# Backend Integration Checklist ✓

Use this checklist to ensure your backend is properly set up.

## Pre-Setup ☑️

- [ ] I have a Supabase account
- [ ] I have created a new Supabase project
- [ ] I have Node.js and npm installed
- [ ] I have cloned/downloaded the project

## Environment Configuration ☑️

- [ ] Created `.env.local` file in project root
- [ ] Added `VITE_SUPABASE_URL` to `.env.local`
- [ ] Added `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env.local`
- [ ] Verified no extra spaces or quotes in env values
- [ ] Confirmed `.env.local` is in `.gitignore`

## Database Setup ☑️

- [ ] Opened Supabase SQL Editor
- [ ] Copied contents of `backend/supabase/migrations/001_initial_setup.sql`
- [ ] Ran the migration in SQL Editor
- [ ] Saw "Success" message
- [ ] Verified tables exist in Database → Tables view
- [ ] Verified badges data exists (should see 10 badges)

## Database Verification ☑️

Verify these tables exist in Supabase Dashboard → Database → Tables:

- [ ] `users` table exists
- [ ] `roasts` table exists
- [ ] `badges` table exists
- [ ] `user_badges` table exists
- [ ] `roast_likes` table exists
- [ ] `leaderboard` view exists (in Views)

## Authentication Setup ☑️

In Supabase Dashboard → Authentication:

- [ ] Email provider is enabled
- [ ] Confirmed email required (or disabled if testing)
- [ ] Optional: Configured email templates
- [ ] Optional: Set up OAuth providers (Google, GitHub, etc.)

## Application Setup ☑️

- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Application opens in browser
- [ ] No critical errors in console
- [ ] Can navigate to auth page

## Authentication Test ☑️

- [ ] Can access `/auth` page
- [ ] Sign Up tab is visible
- [ ] Can enter email and password
- [ ] Sign up form submits
- [ ] Receive confirmation (check email if required)
- [ ] Can sign in with created account
- [ ] Redirected to home page after login
- [ ] User menu shows in navigation
- [ ] User stats show (0 roasts, 0 points initially)

## Feature Test ☑️

- [ ] Cannot access `/` without login (redirects to `/auth`)
- [ ] Cannot access `/leaderboard` without login
- [ ] Cannot access `/badges` without login
- [ ] After login, can access all pages
- [ ] Navigation shows user avatar/menu
- [ ] Can view profile dropdown

## Roast Generation Test ☑️

- [ ] Can paste code in editor
- [ ] Can select language
- [ ] "Roast My Code" button is enabled
- [ ] Click button starts roasting
- [ ] Roast is generated (or error shown)
- [ ] User stats update (roasts count increases)
- [ ] Points increase after roast

## Edge Function (Optional) ☑️

If roast generation fails with function errors:

- [ ] Installed Supabase CLI: `npm install -g supabase`
- [ ] Logged in: `supabase login`
- [ ] Linked project: `supabase link --project-ref xxx`
- [ ] Deployed function: `supabase functions deploy generate-roast`
- [ ] Set API keys if needed: `supabase secrets set OPENAI_API_KEY=xxx`

## Advanced Verification ☑️

- [ ] Check user appears in `users` table (Supabase → Database → users)
- [ ] Check roast appears in `roasts` table after generation
- [ ] Check user stats update in `users` table
- [ ] Check badges awarded in `user_badges` table
- [ ] Leaderboard shows user ranking
- [ ] Can sign out successfully
- [ ] After sign out, redirected to auth page
- [ ] Cannot access protected pages after sign out

## Production Readiness ☑️

- [ ] RLS policies are enabled on all tables
- [ ] Auth is required for all protected routes
- [ ] Database indexes are created
- [ ] Triggers are working (user profile auto-created)
- [ ] Functions are working (badge awarding)
- [ ] No console errors in production build
- [ ] Environment variables are secure (not committed)

## Documentation Review ☑️

- [ ] Read QUICKSTART.md
- [ ] Read BACKEND_SETUP.md
- [ ] Read INTEGRATION_SUMMARY.md
- [ ] Understand backend folder structure
- [ ] Know where to find backend services

## Final Checks ☑️

- [ ] Application works end-to-end
- [ ] Users can sign up and login
- [ ] Protected routes require authentication
- [ ] Roasts can be generated and saved
- [ ] Stats update automatically
- [ ] Leaderboard displays correctly
- [ ] Badges system works

---

## ✅ All Done!

If you've checked all items above, your backend is fully integrated and working!

## 🎉 Next Steps

- Customize the UI/UX
- Add more features (profile page, roast history, etc.)
- Configure production deployment
- Set up custom domain
- Add monitoring and analytics

## 🆘 Issues?

If you couldn't check all items:

1. Review error messages in browser console
2. Check Supabase logs in Dashboard
3. Verify environment variables are correct
4. Re-run database migration if tables missing
5. Check BACKEND_SETUP.md for detailed instructions

---

**Note**: TypeScript errors in backend service files are expected before database setup and will resolve after migration or type regeneration.
