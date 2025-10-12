# Backend - Code Roast Arena

This folder contains all backend-related code and database configurations for the Code Roast Arena project.

## Structure

```
backend/
├── supabase/
│   ├── migrations/        # Database migration files
│   ├── schema.sql         # Complete database schema
│   └── seed.sql           # Initial data seeding
├── config/
│   └── database.ts        # Database configuration
├── services/
│   ├── auth.service.ts    # Authentication service
│   ├── roast.service.ts   # Roast generation service
│   └── user.service.ts    # User management service
└── README.md
```

## Setup Instructions

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create a `.env.local` file in the root directory with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
4. Run the migrations in the Supabase SQL editor or using Supabase CLI

## Database Schema

- **users**: Extended user profile data
- **roasts**: Stores all generated roasts
- **badges**: Available badges/achievements
- **user_badges**: User badge achievements
- **leaderboard**: Computed view for leaderboard data

## Authentication

The project uses Supabase Auth with email/password authentication. Row Level Security (RLS) policies ensure data privacy.
