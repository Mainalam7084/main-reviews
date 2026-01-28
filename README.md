# MainReviews - Netflix-Style Movie Review App

A production-ready, Netflix-style movie review web application built with Next.js, featuring both local and cloud storage modes, PWA support, and internationalization.

## 🎬 Features

- **Dual Storage Modes**
  - **Local Mode**: Works offline using IndexedDB (Dexie) - no login required
  - **Cloud Mode**: Sync reviews across devices with PostgreSQL database
  
- **Movie Data**
  - Primary API: TMDB (The Movie Database)
  - Fallback API: OMDb
  - Comprehensive movie information with posters, cast, crew, and more
  - **Global Cinema Discovery:** Explore movies by region (Spain, India) and industry (Bollywood, Tollywood, Kollywood, Mollywood, Sandalwood, Marathi).
  - **Smart Search:** Dedicated search bars for each category with auto-debouncing and language filtering.

- **Review System**
  - 5-star rating system
  - Custom verdict system (Never Watch, Watch, Recommend, Highly Recommend, Best Ever)
  - Pros/Cons sections
  - Full review text
  - Editable movie metadata

- **User Experience**
  - Netflix-inspired dark/light themes
  - Smooth animations with Framer Motion
  - Skeleton loaders
  - Responsive design
  - PWA - installable on mobile and desktop
  - Accessibility features (keyboard navigation, reduced motion support)
  - **About Page:** Dedicated page explaining the platform's mission.

- **Internationalization**
  - English and Spanish support
  - Easy to add more languages

- **Advanced Features**
  - Search with autocomplete
  - Filter and sort reviews
  - Export/Import reviews as JSON
  - Migrate local reviews to cloud
  - TanStack Query for efficient data fetching and caching

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query + Server Actions
- **Authentication**: NextAuth.js
- **Authentication**: NextAuth.js
- **Database**: Prisma + PostgreSQL
- **Local Storage**: Dexie (IndexedDB)
- **i18n**: next-intl
- **PWA**: next-pwa
- **Validation**: Zod
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (for Cloud Mode - optional)
- TMDB API key (required)
- OMDb API key (required)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/MainReviews.git
cd MainReviews
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required for all modes
TMDB_API_KEY=your_tmdb_api_key_here
OMDB_API_KEY=your_omdb_api_key_here

# Required for Cloud Mode only
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
DATABASE_URL=your_postgresql_connection_string_here
```

#### Getting API Keys

- **TMDB API Key**: Sign up at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **OMDb API Key**: Get a free key at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
- **NextAuth Secret**: Generate with `openssl rand -base64 32`

### 4. Set up the database (Cloud Mode only)

If you want to use Cloud Mode, set up a PostgreSQL database:

#### Option A: Neon (Recommended)

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL` in `.env`

#### Option B: Supabase

1. Sign up at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection pooling" for better performance)
5. Add to `DATABASE_URL` in `.env`

#### Option C: Vercel Postgres

1. In your Vercel project, go to Storage
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL` in `.env`

### 5. Run database migrations (Cloud Mode only)

```bash
npx prisma generate
npx prisma db push
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Add environment variables in Vercel dashboard:
   - `TMDB_API_KEY`
   - `OMDB_API_KEY`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL` (if using Cloud Mode)

4. Deploy!

### Build for production

```bash
npm run build
npm start
```

## 📱 Local Mode vs Cloud Mode

### Local Mode (Default)

- **No login required**
- Data stored in browser's IndexedDB
- Works offline
- Data persists on the same device/browser
- Perfect for personal use

### Cloud Mode

- **Requires authentication**
- Data stored in PostgreSQL database
- Sync across all your devices
- Accessible from anywhere
- Can import local reviews to cloud

### Switching Modes

Go to **Settings** → **Storage Mode** and toggle between Local and Cloud.

## 🎨 Features Guide

### Adding a Review

1. Search for a movie using the search bar
2. Click on a movie card
3. Review and edit movie information
4. Add your rating (1-5 stars)
5. Select a verdict
6. Write pros, cons, and your review
7. Click "Save Review"

### Filtering Reviews

Go to **My Reviews** and use the filters:
- Sort by date, rating, or year
- Filter by verdict
- Filter by star rating
- Search within your reviews

### Exporting/Importing Reviews

**Export**:
1. Go to Settings
2. Click "Export Reviews as JSON"
3. Save the file

**Import**:
1. Go to Settings
2. Click "Import Reviews"
3. Select your JSON file

### Migrating Local to Cloud

1. Sign up/Login
2. Go to Settings
3. Switch to Cloud Mode
4. Click "Import Local Reviews to Cloud"

## 🔧 Development

### Project Structure

```
MainReviews/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── movies/          # Movie data endpoints
│   │   ├── reviews/         # Review CRUD endpoints
│   │   └── search/          # Search endpoint
│   ├── auth/                # Auth pages (login/register)
│   ├── app/                 # Main app pages
│   │   ├── movie/[id]/     # Movie detail page
│   │   ├── reviews/        # My reviews page
│   │   └── settings/       # Settings page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
├── lib/                     # Utilities and libraries
│   ├── api/                # API clients (TMDB, OMDb)
│   ├── auth/               # Auth configuration
│   └── db/                 # Database utilities
├── i18n/                    # Internationalization
│   └── messages/           # Translation files
├── prisma/                  # Prisma schema
├── public/                  # Static assets
└── types/                   # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

### Adding a New Language

1. Create a new translation file in `i18n/messages/[locale].json`
2. Add the locale to `i18n/request.ts`:
   ```typescript
   export const locales = ['en', 'es', 'fr'] as const; // Add 'fr'
   ```
3. Translate all keys from `en.json`

## 🐛 Troubleshooting

### "Module '@prisma/client' has no exported member 'PrismaClient'"

Run `npx prisma generate` to generate the Prisma Client.

### Reviews not saving in Local Mode

Check browser console for IndexedDB errors. Clear browser data and try again.

### API rate limits

- TMDB: 40 requests per 10 seconds
- OMDb: 1000 requests per day (free tier)

Consider implementing request throttling for production use.

### PWA not installing

- Ensure you're using HTTPS (or localhost)
- Check that manifest.json is accessible
- Verify service worker is registered

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and modern web technologies**
