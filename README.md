# Main Reviews

A modern movie review application built with Next.js, featuring dual-mode operation for both local and cloud-based review management.

---

## Features

### Dual Mode Operation

#### Local Mode
- Create and manage movie reviews without signing in.
- Reviews are stored locally in the browser using IndexedDB.
- Ensures privacy by default as data stays on the user's device.
- Option to migrate and publish reviews publicly after creating an account.

#### Cloud Mode
- Securely save reviews to a cloud database for cross-device access.
- Full CRUD (Create, Read, Update, Delete) operations on reviews.
- Granular control over review visibility (Private or Public).

### Public Review Discovery
- Browse a curated list of public reviews from the community.
- Advanced filtering by title, release year, and rating.
- Sorting options for most recent, highest rated, and oldest reviews.
- Responsive grid layout optimized for all device sizes.

### Movie Data Integration
- Powered by TMDB (The Movie Database) API for rich metadata.
- Fallback support for OMDb API to ensure comprehensive movie coverage.
- Detailed movie information including cast, crew, and technical specifications.

---

## Technical Stack

- **Frontend Framework**: Next.js (App Router)
- **Authentication**: NextAuth.js
- **Database**: Neon Postgres (Serverless)
- **ORM**: Prisma
- **Client-side Storage**: IndexedDB (via Dexie)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **State Management**: TanStack Query
- **Development Language**: TypeScript

---

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Neon Postgres database account
- TMDB API key
- OMDb API key

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MainReviews
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and provide the following values:

```env
# Movie APIs
TMDB_API_KEY=your_tmdb_api_key
OMDB_API_KEY=your_omdb_api_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your_postgresql_connection_string
```

### 4. Initialize Database
```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Start Development Server
```bash
npm run dev
```
The application will be available at http://localhost:3000.

---

## Project Structure

- **app/**: Application routes, API endpoints, and page layouts.
- **components/**: Reusable UI elements and feature-specific components.
- **lib/**: Utility functions, database configurations, and API clients.
- **prisma/**: Database schema and migration files.
- **public/**: Static assets and icons.
- **types/**: TypeScript type definitions and interfaces.

---

## Security

- **Encrypted Sessions**: JWT-based authentication with secure cookies.
- **Data Protection**: Industry-standard password hashing using bcryptjs.
- **Input Validation**: Strict schema validation for environment variables and forms using Zod.
- **Query Safety**: Parameterized database queries via Prisma to prevent SQL injection.

---

## Deployment

The application is optimized for deployment on the Vercel platform.

1. Connect your GitHub repository to Vercel.
2. Configure the required environment variables in the Vercel dashboard.
3. The build process will automatically handle Prisma client generation.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

---

## Support

For technical support or feature requests, please open an issue in the GitHub repository.
