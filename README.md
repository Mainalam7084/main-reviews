# 🎬 Main Reviews

A modern, Netflix-style movie review application built with Next.js, featuring both local and cloud modes for maximum flexibility.

## ✨ Features

### 🌐 Dual Mode Operation

**Local Mode (No Login Required)**
- Create and manage movie reviews without signing in
- Reviews stored locally in your browser (IndexedDB)
- Perfect for privacy-conscious users
- Option to publish reviews publicly after creating an account

**Cloud Mode (Logged In)**
- Save reviews to the cloud database
- Access your reviews from any device
- Choose to make reviews private or public
- Full CRUD operations on your reviews

### 🔓 Public Reviews
- Browse all public reviews without logging in
- Netflix-style grid layout
- Advanced filtering and search:
  - Sort by most recent, highest rated, or oldest
  - Search by movie title
  - Filter by year
- Pagination for smooth browsing

### 🎥 Movie Data
- Integration with TMDB (The Movie Database) API
- Fallback to OMDb API for comprehensive coverage
- Rich movie metadata including posters, cast, directors, and more

### 🔐 Authentication
- NextAuth with JWT sessions
- Secure credential-based authentication
- Prisma adapter for user management
- Password hashing with bcryptjs

### 👤 Account Management
- **Profile Settings**: Update display name
- **Security**: Account deletion (Danger Zone) with cascade delete of all data
- **Privacy**: Control review visibility


## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: NextAuth v4
- **Database**: Neon Postgres (serverless)
- **ORM**: Prisma
- **Local Storage**: Dexie (IndexedDB wrapper)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)
- **TypeScript**: Full type safety

## 📋 Prerequisites

- Node.js 18+ and npm
- A Neon Postgres database (free tier available)
- TMDB API key
- OMDb API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd MainReviews
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Movie APIs (Required)
TMDB_API_KEY=your_tmdb_api_key_here
OMDB_API_KEY=your_omdb_api_key_here

# Authentication (Required)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database (Required - Neon Postgres)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**How to get API keys:**
- **TMDB API Key**: Sign up at [themoviedb.org](https://www.themoviedb.org/settings/api)
- **OMDb API Key**: Get one at [omdbapi.com](http://www.omdbapi.com/apikey.aspx)
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32` or use [generate-secret.vercel.app](https://generate-secret.vercel.app/32)
- **DATABASE_URL**: Create a free database at [neon.tech](https://neon.tech)

### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `TMDB_API_KEY`
   - `OMDB_API_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `DATABASE_URL` (your Neon Postgres connection string)
4. Deploy!

### Database Migrations

Vercel will automatically run `prisma generate` via the `postinstall` script. For migrations:

```bash
# On your local machine, after schema changes
npx prisma migrate dev --name your_migration_name

# Commit the migration files
git add prisma/migrations
git commit -m "Add database migration"
git push
```

## 🏗️ Project Structure

```
MainReviews/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth API routes
│   │   ├── reviews/       # Review CRUD endpoints
│   │   ├── public-reviews/ # Public reviews endpoint
│   │   ├── migrate-review/ # Local to cloud migration
│   │   └── register/      # User registration
│   ├── auth/              # Auth pages (login, register)
│   ├── public/            # Public reviews page
│   ├── movies/            # Movie browsing pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/
│   ├── auth/              # Auth configuration
│   ├── db/                # Local database (Dexie)
│   ├── api/               # API clients (TMDB, OMDb)
│   ├── prisma.ts          # Prisma client
│   └── env.ts             # Environment validation
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

## 🔒 Security Features

- **JWT Sessions**: Stateless authentication with encrypted cookies
- **Password Hashing**: bcryptjs for secure password storage
- **Environment Validation**: Zod schema validation for env vars
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Protection**: Next.js built-in security headers
- **Private by Default**: Reviews are private unless explicitly made public

## 📝 How It Works

### Local Mode Flow
1. User creates a review without logging in
2. Review is stored in browser's IndexedDB
3. User can optionally toggle "Publish publicly"
4. If public is enabled, user is prompted to create an account
5. After login, local review is migrated to cloud database

### Cloud Mode Flow
1. User logs in or registers
2. Reviews are saved directly to Neon Postgres
3. User can toggle `isPublic` on any review
4. Public reviews appear on `/public` page for everyone

### Public Reviews
- Anyone can view public reviews at `/public`
- No authentication required
- Reviews show movie info, rating, verdict, and author
- Advanced filtering and search capabilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [OMDb](http://www.omdbapi.com/) for additional movie information
- [Neon](https://neon.tech) for serverless Postgres
- [Vercel](https://vercel.com) for hosting

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**
