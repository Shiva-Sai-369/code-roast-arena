# Code Roast Arena - Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + TypeScript)                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Auth Page   │  │  Main Page   │  │  Leaderboard │              │
│  │  /auth       │  │  /           │  │  /leaderboard│              │
│  │  (Public)    │  │  (Protected) │  │  (Protected) │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Auth Context Provider                       │   │
│  │  - User state management                                      │   │
│  │  - Profile data                                               │   │
│  │  - Authentication status                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              ↓                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   Protected Route Guard                       │   │
│  │  - Checks authentication                                      │   │
│  │  - Redirects to /auth if not logged in                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  backend/                                                            │
│  ├── services/                                                       │
│  │   ├── auth.service.ts                                            │
│  │   │   • signUp()           • signIn()                            │
│  │   │   • signOut()          • getSession()                        │
│  │   │   • resetPassword()    • getCurrentUser()                    │
│  │   │                                                               │
│  │   ├── user.service.ts                                            │
│  │   │   • getUserProfile()   • updateProfile()                     │
│  │   │   • getUserBadges()    • getLeaderboard()                    │
│  │   │   • isUsernameAvailable()                                    │
│  │   │                                                               │
│  │   └── roast.service.ts                                           │
│  │       • generateRoast()    • saveRoast()                         │
│  │       • getUserRoasts()    • getPublicRoasts()                   │
│  │       • likeRoast()        • unlikeRoast()                       │
│  │       • deleteRoast()                                            │
│  │                                                                   │
│  └── config/                                                         │
│      └── database.ts                                                 │
│          • Supabase client configuration                            │
│          • Connection management                                     │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPABASE BACKEND                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Authentication (Supabase Auth)             │   │
│  │  • Email/Password authentication                              │   │
│  │  • Session management                                         │   │
│  │  • Password reset                                             │   │
│  │  • OAuth providers (optional)                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Database (PostgreSQL)                      │   │
│  │                                                               │   │
│  │  Tables:                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │  users   │  │  roasts  │  │  badges  │  │  likes   │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │   │
│  │                                                               │   │
│  │  Views:                                                       │   │
│  │  ┌────────────────┐                                          │   │
│  │  │  leaderboard   │  (Computed ranking)                      │   │
│  │  └────────────────┘                                          │   │
│  │                                                               │   │
│  │  Functions:                                                   │   │
│  │  • handle_new_user()          - Auto-create profile          │   │
│  │  • update_user_stats()        - Update stats on roast        │   │
│  │  • check_and_award_badges()   - Award achievements          │   │
│  │  • update_roast_likes_count() - Maintain like counts        │   │
│  │                                                               │   │
│  │  Triggers:                                                    │   │
│  │  • on_auth_user_created       - Profile creation             │   │
│  │  • on_roast_created           - Stats update                 │   │
│  │  • on_roast_like_change       - Like count update            │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Row Level Security (RLS) Policies                │   │
│  │  • Users can only edit own profile                           │   │
│  │  • Public roasts visible to all                              │   │
│  │  • Private data protected                                    │   │
│  │  • Authentication required for modifications                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  Edge Functions (Optional)                    │   │
│  │  • generate-roast - AI-powered roast generation              │   │
│  │  • Uses OpenAI or other AI service                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                            DATA FLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════

1. USER SIGNUP
   ┌──────────┐     signup()      ┌──────────────┐
   │  User    │ ─────────────────> │ Auth Service │
   └──────────┘                    └──────────────┘
                                          │
                                          ↓
                                   ┌──────────────┐
                                   │ Supabase Auth│
                                   └──────────────┘
                                          │
                                          ↓ (trigger)
                                   ┌──────────────┐
                                   │ Create Profile│
                                   │ in users table│
                                   └──────────────┘

2. GENERATE ROAST
   ┌──────────┐  generateRoast() ┌──────────────┐
   │  User    │ ─────────────────> │Roast Service │
   └──────────┘                    └──────────────┘
                                          │
                                          ↓
                                   ┌──────────────┐
                                   │ Edge Function│
                                   │ (AI Service) │
                                   └──────────────┘
                                          │
                                          ↓
                                   ┌──────────────┐
                                   │ Save to DB   │
                                   └──────────────┘
                                          │
                                          ↓ (trigger)
                                   ┌──────────────┐
                                   │ Update Stats │
                                   │ Award Badges │
                                   └──────────────┘

3. VIEW LEADERBOARD
   ┌──────────┐ getLeaderboard() ┌──────────────┐
   │  User    │ ─────────────────> │ User Service │
   └──────────┘                    └──────────────┘
                                          │
                                          ↓
                                   ┌──────────────┐
                                   │Query View    │
                                   │(leaderboard) │
                                   └──────────────┘
                                          │
                                          ↓
                                   ┌──────────────┐
                                   │Return Ranking│
                                   └──────────────┘


═══════════════════════════════════════════════════════════════════════
                           SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════

Level 1: Frontend Route Protection
   • ProtectedRoute component
   • Redirects unauthenticated users to /auth

Level 2: Context-Level Authentication
   • AuthContext verifies session
   • Manages user state globally

Level 3: Service-Level Checks
   • Each service method checks authentication
   • Returns errors for unauthorized requests

Level 4: Database RLS Policies
   • PostgreSQL enforces data access rules
   • Users can only modify own data
   • Public data visible, private data protected

Level 5: Supabase Auth
   • Manages sessions and tokens
   • Handles password hashing
   • Provides secure authentication


═══════════════════════════════════════════════════════════════════════
                          FOLDER STRUCTURE
═══════════════════════════════════════════════════════════════════════

project-root/
│
├── backend/                    ← ALL BACKEND CODE HERE
│   ├── config/
│   ├── services/
│   ├── supabase/
│   └── index.ts
│
├── src/                        ← Frontend code
│   ├── components/
│   ├── contexts/               ← Auth context
│   ├── pages/
│   └── integrations/           ← Supabase client
│
├── .env.local                  ← Environment variables (gitignored)
├── .env.example                ← Template
│
└── Documentation/
    ├── BACKEND_SETUP.md
    ├── INTEGRATION_SUMMARY.md
    ├── QUICKSTART.md
    └── SETUP_CHECKLIST.md

```

## Key Design Principles

1. **Separation of Concerns**: Backend logic isolated in `backend/` folder
2. **Service Pattern**: Business logic in dedicated service classes
3. **Type Safety**: Full TypeScript support throughout
4. **Security First**: Authentication required, RLS enabled
5. **Scalability**: Modular architecture, easy to extend
6. **Developer Experience**: Clear documentation, easy setup

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: React Context API
- **Routing**: React Router with protected routes
- **Type Safety**: TypeScript with auto-generated DB types
