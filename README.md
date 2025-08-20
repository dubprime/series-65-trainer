# Theme Train - Series 65 Study App

Interactive study app for Series 65 exam preparation built with Next.js, TailwindCSS, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm
- Docker (for local Supabase)

### Installation
```bash
# Install dependencies
pnpm install

# Start the development server
./start.sh
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## 🗄️ Local Development

### Supabase Setup
This project uses Supabase for local development. The local instance runs on:
- **API**: http://127.0.0.1:54321
- **Studio**: http://127.0.0.1:54323 (Database management)
- **Database**: postgresql://127.0.0.1:54322

### Database Reset
When you reset the database (e.g., after schema changes):
```bash
supabase db reset
```

This will:
- Recreate all tables from migrations
- Seed the database with sample questions
- **Note**: All user accounts will be deleted

### Quick Test User Creation
After a database reset, quickly create a test account:
```bash
node scripts/create-test-user.js
```

**Test Credentials**:
- Email: `test@example.com`
- Password: `testpass123`

## 🏗️ Project Structure

```
theme-train/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   ├── questions/         # Study questions
│   └── health/           # Health check endpoint
├── components/            # Reusable components
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase client setup
├── supabase/              # Database configuration
│   ├── migrations/        # Database schema
│   └── seed.sql          # Sample data
└── scripts/               # Development utilities
```

## 📊 Current Status

### ✅ Completed
- **Milestone 1**: Project Bootstrap (Next.js + Tailwind + Supabase)
- **Milestone 2**: Database + Authentication System
- **Milestone 3**: Questions Module MVP (Partially Complete)

### 🚧 In Progress
- **Milestone 3**: Questions Module MVP
  - ✅ Database seeding with sample questions
  - ✅ Questions display page
  - 🔄 Question interface implementation
  - ⏳ Answer capture and storage
  - ⏳ Study session flow

### 🎯 Next Steps
- Complete question interface with answer selection
- Implement answer storage and progress tracking
- Build study session management
- Add scoring and feedback system

## 🔧 Development Commands

```bash
# Start development server
./start.sh

# Reset database (clears all data)
supabase db reset

# Create test user after reset
node scripts/create-test-user.js

# View database status
supabase status

# Access Supabase Studio
open http://127.0.0.1:54323
```

## 🧪 Testing

The app includes several test endpoints:
- `/health` - API health check
- `/test-supabase` - Database connection test
- `/questions` - Questions display (requires authentication)

## 📝 Notes

- **Email Confirmation**: Disabled in local development for easier testing
- **Database**: Local PostgreSQL instance managed by Supabase
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Data**: Sample Series 65 exam questions included

## 🤝 Contributing

1. Follow the existing code style (tabs, TypeScript)
2. Use the task list in `.cursor/task_list.md` for development
3. Test with the local Supabase instance
4. Update documentation as needed
