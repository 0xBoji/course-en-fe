# Course Enrollment System

A modern course management and enrollment platform built with Next.js 15, featuring admin authentication, course CRUD operations, and student management.

## 🚀 Features

- **Admin Authentication** - Secure login with JWT tokens
- **Course Management** - Create, read, update, delete courses
- **Student Enrollment** - Manage student enrollments per course
- **Search & Pagination** - Efficient course browsing with filters
- **Responsive Design** - Mobile-first UI with shadcn/ui components
- **Real-time Updates** - Optimistic updates with React Query

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **State Management:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios with interceptors
- **Notifications:** Sonner toast

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd course-en-fe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://13.236.2.172:8080
NEXT_PUBLIC_API_VERSION=/api/v1
```

## 🎯 Usage

### Admin Login
- **Username:** `admin`
- **Password:** `admin!dev`

### Available Routes
- `/` - Home page
- `/login` - Admin authentication
- `/courses` - Course listing with search/pagination
- `/courses/create` - Create new course
- `/courses/[id]` - Course details with student management

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── course/         # Course-related components
│   ├── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
│   ├── api/            # API client and endpoints
│   ├── auth/           # Authentication logic
│   └── types/          # TypeScript type definitions
```

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## 📋 API Integration

The frontend integrates with a REST API providing:
- Course CRUD operations
- Student enrollment management
- Authentication endpoints
- Pagination and search

## 🤝 Contributing

1. Follow conventional commit format
2. Use TypeScript for type safety
3. Maintain responsive design principles
4. Write clean, documented code

## 📄 License

MIT License - see LICENSE file for details.
