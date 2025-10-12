# Code Roast Arena 🔥

An AI-powered code roasting platform where developers can get hilarious, brutally honest feedback on their code!

## Project info

**URL**: https://lovable.dev/projects/274daf6a-4256-4366-a31f-c9bed1cb0c7c

## Features

- 🔐 **Secure Authentication**: User signup/login required to access features
- 🔥 **AI-Powered Roasts**: Generate hilarious roasts for your code
- 🏆 **Leaderboard**: Compete with other developers
- 🎖️ **Badges**: Earn achievements for your roasting activity
- 📊 **User Profiles**: Track your stats and progress
- 💾 **Database Integration**: All data stored securely in Supabase

## Backend Architecture

This project uses a **dedicated backend folder structure** with Supabase as the database and authentication provider. All backend code is organized in the `backend/` directory:

```
backend/
├── config/          # Database configuration
├── services/        # Business logic services
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── roast.service.ts
└── supabase/        # Database schema and migrations
    ├── schema.sql
    └── seed.sql
```

## Setup Instructions

### 1. Clone and Install

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd code-roast-arena

# Install dependencies
npm i
```

### 2. Backend Setup

**⚠️ IMPORTANT**: You must set up the backend before the app will work!

Follow the detailed guide in [BACKEND_SETUP.md](./BACKEND_SETUP.md) to:

1. Create a Supabase project
2. Set up environment variables
3. Run database migrations
4. Configure authentication

Quick start:

```sh
# 1. Copy the example env file
cp .env.example .env.local

# 2. Edit .env.local with your Supabase credentials
# Get these from your Supabase project dashboard

# 3. Run the database schema in Supabase SQL Editor
# (See BACKEND_SETUP.md for details)
```

### 3. Start Development Server

```sh
npm run dev
```

Visit `http://localhost:5173` and sign up to start using the app!

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/274daf6a-4256-4366-a31f-c9bed1cb0c7c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/274daf6a-4256-4366-a31f-c9bed1cb0c7c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
