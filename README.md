# 🚀 Team Tasks - Professional Kanban Board Application

A modern, professional team task management application built with Next.js 15, React 19, and Tailwind CSS v4. Features a beautiful Kanban board with smooth animations, optimistic updates, and real-time task management.

![Team Tasks Board](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 **Core Functionality**

- **Kanban Board**: Three-column layout (Todo, In Progress, Done)
- **Task Management**: Create, edit, delete, and move tasks
- **Priority System**: Low, Medium, High priority levels
- **Assignee Management**: Assign tasks to team members
- **Due Dates**: Track task deadlines

### 🎨 **Professional UI/UX**

- **Modern Design**: Clean, professional interface with Tailwind CSS v4
- **Theme Support**: Light, dark, and system theme modes
- **Responsive Layout**: Works perfectly on all device sizes
- **Smooth Animations**: Professional task movement with progress bars
- **Loading States**: Visual feedback for all operations

### ⚡ **Advanced Features**

- **Optimistic Updates**: Immediate UI feedback with Zustand
- **Smooth Animations**: Professional task movement animations with progress bars
- **Real-time Updates**: Instant task movement between columns
- **Professional Loading**: Visual overlays and progress indicators
- **Seamless Experience**: No infinite loading states - tasks move smoothly every time

### 🗄️ **Backend & Database**

- **PostgreSQL**: Robust database with Docker setup
- **Drizzle ORM**: Type-safe database operations
- **Server Actions**: Next.js 15 server-side mutations
- **Automatic Revalidation**: Real-time data updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand for client-side, Server Actions for database
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: ESLint, Turbopack, Docker
- **Theme**: next-themes for light/dark mode

## 🚀 Quick Start

> **🎉 Latest Update**: Fixed infinite loading states in task movement for seamless user experience!

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/team-tasks.git
cd team-tasks
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
cp .env.example .env.local
# Edit .env.local with your database credentials
```

### 4. Start Database

```bash
npm run db:start
```

### 5. Run Database Migrations

```bash
npm run db:migrate
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📁 Project Structure

```
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # Global styles and theme variables
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main kanban board page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── kanban-board.tsx  # Main board component
│   ├── task-card.tsx     # Individual task display
│   └── task-movement.tsx # Smooth animation component
├── lib/                  # Utilities and configurations
│   ├── actions.ts        # Server actions
│   ├── store.ts          # Zustand state management
│   └── db/               # Database configuration
└── docker-compose.yml    # PostgreSQL setup
```

## 🎮 Usage

### Creating Tasks

1. Click the "Add Task" button in any column
2. Fill in task details (title, description, assignee, priority, due date)
3. Click "Create Task" to add it to the board

### Moving Tasks

1. Click the ellipsis menu (⋯) on any task card
2. Select "Move to [Column Name]" from the dropdown
3. Watch the smooth animation as the task moves between columns
4. **Smooth Experience**: No more infinite loading states - tasks move seamlessly!

### Editing Tasks

1. Click the ellipsis menu (⋯) on any task card
2. Select "Edit Task" from the dropdown
3. Modify task details and save changes

### Deleting Tasks

1. Click the ellipsis menu (⋯) on any task card
2. Select "Delete Task" from the dropdown
3. Confirm deletion in the confirmation dialog

## 🗄️ Database Management

### Start Database

```bash
npm run db:start
```

### Stop Database

```bash
npm run db:stop
```

### View Database (Drizzle Studio)

```bash
npm run db:studio
```

Visit [https://local.drizzle.studio](https://local.drizzle.studio) to manage your data.

### Run Migrations

```bash
npm run db:migrate
```

### Seed Database

```bash
npm run db:seed
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:*` - Database management commands

### Code Quality

- **ESLint**: Configured for Next.js and TypeScript
- **TypeScript**: Strict type checking enabled
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for code quality

## 🌟 Key Features Explained

### Optimistic Updates

Tasks move instantly in the UI while database updates happen in the background, providing immediate visual feedback.

### Smooth Animations

Professional task movement with progress bars, floating cards, and destination highlighting using `requestAnimationFrame`.

### State Management

- **Zustand**: Client-side state for immediate UI updates
- **Server Actions**: Database operations with automatic revalidation
- **Loading Context**: Cross-component loading state coordination

## 🔧 Recent Improvements & Bug Fixes

### ✅ Fixed Infinite Loading States (Latest)

- **Issue**: Tasks would show infinite "Processing..." bars after movement
- **Root Cause**: Race condition between database operations and loading state cleanup
- **Solution**: Restructured task movement timing for proper state synchronization
- **Result**: Smooth task movement with no lingering loading states

### 🚀 Performance Enhancements

- **Optimized Loading States**: Immediate cleanup after database operations
- **Enhanced Animation Timing**: Separated visual effects from state management
- **Robust Error Handling**: Better recovery from failed operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database toolkit
- [Zustand](https://github.com/pmndrs/zustand) - State management

## 📞 Support

If you have any questions or need help:

- Create an [Issue](https://github.com/yourusername/team-tasks/issues)
- Check the [Documentation](https://github.com/yourusername/team-tasks/wiki)
- Contact: your.email@example.com

---

**Made with ❤️ by [Your Name]**

_Built for modern teams who deserve better task management_
