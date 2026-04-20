# Contributing to Main Reviews

Thank you for your interest in contributing to Main Reviews! We welcome contributions from the community. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)

## Code of Conduct

Be respectful, inclusive, and professional in all interactions. We are committed to providing a welcoming and inspiring community for all.

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or yarn
- Git
- A PostgreSQL database (for local development)
- TMDB API key (https://www.themoviedb.org/settings/api)
- OMDb API key (https://www.omdbapi.com/apikey.aspx) (optional)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/main-reviews.git
   cd main-reviews
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/Mainalam7084/main-reviews.git
   ```

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/main_reviews"

# API Keys
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# (Optional) For production
NEXTAUTH_URL_INTERNAL=http://localhost:3000
```

Generate a NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Setup Database

```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Making Changes

### Create a Branch

Create a feature branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation improvements
- `refactor/` - for code refactoring
- `test/` - for test additions

### Development Workflow

1. Make your changes in the appropriate files
2. Test your changes locally
3. Commit your changes with clear messages (see [Commits](#commits))
4. Push to your fork
5. Submit a pull request

## Code Style Guidelines

### TypeScript

- Use strict TypeScript mode
- Prefer explicit types over implicit types
- Use type aliases for complex types
- Avoid `any` type

```typescript
// Good
type UserRole = 'admin' | 'user' | 'guest';
interface Review {
  id: string;
  title: string;
  rating: number;
}

// Avoid
const user: any = getUserData();
```

### React Components

- Functional components with hooks
- Use TypeScript for prop types
- Descriptive component names

```typescript
// Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  onClick, 
  children 
}) => {
  // component logic
};
```

### Naming Conventions

- Files: use kebab-case (e.g., `review-card.tsx`)
- Components: use PascalCase (e.g., `ReviewCard`)
- Hooks: use camelCase with `use` prefix (e.g., `useReviews`)
- Constants: use UPPER_SNAKE_CASE (e.g., `MAX_REVIEW_LENGTH`)
- Routes: use kebab-case (e.g., `/api/reviews/[id]`)

### CSS and Styling

- Use Tailwind CSS classes
- Follow the Tailwind class organization: layout → box model → typography → effects
- Create Tailwind components for reusable styles
- Avoid inline styles

```typescript
// Good
className="flex items-center justify-between px-4 py-2 bg-blue-500 rounded-lg"

// Avoid
style={{ display: 'flex', padding: '8px 16px' }}
```

### Imports

- Use absolute imports from configured paths
- Organize imports: external → internal → types
- Sort imports alphabetically

```typescript
// Good
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';
import { getReviews } from '@/lib/api';

import type { Review } from '@/types/review';
```

### Commits

Use clear, descriptive commit messages:

```
feat: add review filtering by rating
fix: resolve issue with pagination in public reviews
docs: update API documentation
refactor: simplify review form logic
test: add tests for authentication
```

Format: `<type>: <subject>`

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features
- Write tests for bug fixes
- Aim for meaningful test coverage
- Use descriptive test names

```typescript
describe('ReviewCard', () => {
  it('should display the review rating', () => {
    // test implementation
  });

  it('should call onEdit when edit button is clicked', () => {
    // test implementation
  });
});
```

### Type Checking

```bash
# Run TypeScript type checking
npx tsc --noEmit
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

## Submitting Changes

### Before Submitting

1. Ensure your branch is up to date with upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Run all checks locally:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm test
   npm run build
   ```

3. Test your changes manually in the browser

### Create a Pull Request

1. Push your branch to your fork
2. Go to GitHub and create a pull request
3. Fill out the PR template with:
   - Clear description of changes
   - Link to related issues
   - Screenshots (if UI changes)
   - Testing instructions
   - Checklist of completed items

### PR Guidelines

- One feature/fix per PR when possible
- Keep PRs focused and reasonably sized
- Write clear PR descriptions
- Respond to code review feedback promptly
- Ensure all checks pass before merge

## Project Structure

```
main-reviews/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── movies/            # Movie-related pages
│   ├── reviews/           # Review pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── reviews/          # Review-specific components
├── lib/                   # Utility functions and helpers
│   ├── api/             # API clients
│   ├── auth/            # Auth configuration
│   └── db/              # Database utilities
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
├── i18n/                 # Internationalization
├── public/               # Static files
└── tests/                # Test files

```

## Common Tasks

### Adding a New API Route

1. Create a file in `app/api/your-endpoint/route.ts`
2. Implement GET, POST, PUT, DELETE as needed
3. Add proper error handling and validation
4. Write tests for the endpoint

### Adding a New Component

1. Create component file in `components/`
2. Write component with TypeScript props interface
3. Export from index file if it's in a subdirectory
4. Add Storybook story if applicable
5. Update documentation if needed

### Database Schema Changes

1. Modify `prisma/schema.prisma`
2. Generate migration:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```
3. Review the generated migration
4. Test locally
5. Commit both schema and migration files

### Adding i18n Strings

1. Add strings to `i18n/messages/en.json` and other language files
2. Use `useTranslations()` hook in components
3. Test with different language settings

## Need Help?

- Check existing issues and discussions
- Create an issue for bugs or features
- Ask questions in pull request comments
- Check the README for additional project information

Thank you for contributing! 🎉
