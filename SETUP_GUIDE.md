# 🚀 MainReviews Setup Guide

**Current Status**: ✅ Prisma Client has been generated successfully!

This guide will walk you through the remaining steps to get your MainReviews app fully functional.

---

## 📋 What You Need to Do ow

### Step 1: Get Your API Keys (REQUIRED)

Your app needs two API keys to fetch movie data. Both are **free** and **required** for the app to work.

#### 🎬 TMDB API Key (Primary Movie Data Source)

1. Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Create a free account
3. Verify your email
4. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
5. Click "Create" under "Request an API Key"
6. Choose "Developer" option
7. Fill out the form (you can use placeholder info for personal projects)
8. Copy your **API Key (v3 auth)**

#### 🎥 OMDb API Key (Fallback Movie Data Source)

1. Go to [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Select "FREE" (1,000 daily limit)
3. Enter your email
4. Check your email for the activation link
5. Click the activation link
6. Copy your API key from the email

#### 🔐 NextAuth Secret (For Cloud Mode - Optional for now)

If you want to use Cloud Mode (login and sync across devices), you'll need this:

**Windows PowerShell:**
```powershell
# Generate a random secret
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Or use an online generator: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

---

### Step 2: Update Your .env File

Open your `.env` file and add the API keys you just obtained:

```env
# TMDB API Key (Required)
TMDB_API_KEY=paste_your_tmdb_key_here

# OMDb API Key (Required for fallback)
OMDB_API_KEY=paste_your_omdb_key_here

# NextAuth Configuration (Required for Cloud Mode - can skip for now)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=paste_your_generated_secret_here

# Database URL (Already configured with Prisma Postgres)
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ"
```

**Important**: Replace `paste_your_tmdb_key_here` and `paste_your_omdb_key_here` with your actual API keys!

---

### Step 3: Set Up Your Database (For Cloud Mode)

You have a local Prisma Postgres database configured. Now you need to create the database tables:

```bash
npx prisma db push
```

This command will:
- Create all the tables defined in your `schema.prisma` file
- Set up the User, Review, Account, Session, and VerificationToken tables

**Note**: If you see any errors about the database connection, you may need to start your local Prisma Postgres server first.

---

### Step 4: Start the Development Server

```bash
npm run dev
```

Your app will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🎯 Quick Start Options

### Option A: Local Mode (Easiest - No Database Required)

1. ✅ Get TMDB and OMDb API keys (Step 1)
2. ✅ Add them to `.env` (Step 2)
3. ✅ Run `npm run dev` (Step 4)
4. 🎉 Start using the app!

**In Local Mode:**
- No login required
- Reviews stored in your browser (IndexedDB)
- Works offline
- Perfect for personal use

### Option B: Cloud Mode (Full Features)

1. ✅ Complete all steps above (Steps 1-4)
2. ✅ Make sure your database is running
3. ✅ Run `npx prisma db push`
4. ✅ Add NEXTAUTH_SECRET to `.env`
5. 🎉 You can now login and sync reviews across devices!

---

## 🔍 Verify Everything is Working

### Check 1: API Keys
Visit [http://localhost:3000](http://localhost:3000) and try searching for a movie. If you see results, your API keys are working!

### Check 2: Database (Cloud Mode)
Open Prisma Studio to view your database:
```bash
npx prisma studio
```
This will open a GUI at [http://localhost:5555](http://localhost:5555) where you can see your database tables.

### Check 3: TypeScript Errors
All TypeScript errors related to Prisma should be gone now. If you still see errors:
1. Restart your TypeScript server in VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. Close and reopen your editor

---

## 📚 What's Next?

### Using the App

1. **Search for Movies**: Use the search bar to find movies
2. **Add Reviews**: Click on a movie, rate it, and write your review
3. **View Your Reviews**: Go to "My Reviews" to see all your reviews
4. **Filter & Sort**: Use filters to organize your reviews
5. **Export/Import**: Backup your reviews as JSON files

### Switching Between Modes

- Go to **Settings** → **Storage Mode**
- Toggle between Local and Cloud
- You can migrate local reviews to cloud when ready!

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@prisma/client'"
**Solution**: Run `npx prisma generate` again

### Issue: "API key is invalid"
**Solution**: 
- Double-check your API keys in `.env`
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing `.env`

### Issue: Database connection error
**Solution**:
- Make sure your Prisma Postgres server is running
- Check that the `DATABASE_URL` in `.env` is correct
- Try running `npx prisma db push` again

### Issue: Reviews not saving in Local Mode
**Solution**:
- Check browser console for errors
- Make sure you're not in private/incognito mode
- Try clearing browser cache and reload

### Issue: TypeScript errors still showing
**Solution**:
- Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Close and reopen VS Code
- Run `npx prisma generate` again

---

## 🎨 Features Overview

### ✨ What You Can Do

- **Search Movies**: Search from thousands of movies using TMDB
- **Rate & Review**: 5-star rating + custom verdict system
- **Organize**: Filter by rating, verdict, year, or search
- **Export/Import**: Backup and restore your reviews
- **Offline Support**: Works offline in Local Mode
- **PWA**: Install as an app on your phone or desktop
- **Dark/Light Theme**: Beautiful Netflix-inspired themes
- **Multilingual**: English and Spanish support

### 🎯 Review System

- **Star Rating**: 1-5 stars
- **Verdict Options**:
  - 🚫 Never Watch
  - 👍 Watch
  - ⭐ Recommend
  - 🌟 Strongly Recommend
  - 🏆 Best Ever
- **Detailed Review**: Pros, Cons, and full review text
- **Movie Metadata**: Edit title, year, poster, cast, etc.

---

## 📖 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run linter

# Database (Prisma)
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Push schema to database
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Create a migration

# Debugging
npx prisma validate     # Validate schema
npx prisma format       # Format schema file
```

---

## 🚀 Deployment (When Ready)

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variables:
   - `TMDB_API_KEY`
   - `OMDB_API_KEY`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL` (use Neon, Supabase, or Vercel Postgres)
4. Deploy!

### Database Options for Production

- **Neon** (Recommended): [https://neon.tech](https://neon.tech) - Free tier available
- **Supabase**: [https://supabase.com](https://supabase.com) - Free tier available
- **Vercel Postgres**: Built into Vercel platform
- **Railway**: [https://railway.app](https://railway.app) - PostgreSQL hosting

---

## 📞 Need Help?

- Check the main [README.md](./README.md) for more details
- Open an issue on GitHub
- Check the browser console for error messages
- Make sure all dependencies are installed: `npm install`

---

## ✅ Checklist

Use this checklist to track your progress:

- [ ] Got TMDB API key
- [ ] Got OMDb API key
- [ ] Added API keys to `.env` file
- [ ] (Optional) Generated NextAuth secret
- [ ] (Optional) Added NextAuth secret to `.env`
- [ ] Ran `npx prisma generate` ✅ (Already done!)
- [ ] (Cloud Mode) Ran `npx prisma db push`
- [ ] Started dev server with `npm run dev`
- [ ] Tested searching for a movie
- [ ] Created your first review
- [ ] Explored the settings page

---

**Happy Reviewing! 🎬✨**

If you encounter any issues, don't hesitate to ask for help!
