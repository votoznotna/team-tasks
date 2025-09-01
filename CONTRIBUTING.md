# Contributing to Team Tasks

Thank you for your interest in contributing to Team Tasks! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- Git

### Setup Development Environment
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/team-tasks.git`
3. Install dependencies: `npm install`
4. Set up environment: `cp .env.example .env.local`
5. Start database: `npm run db:start`
6. Run migrations: `npm run db:migrate && npm run db:seed`
7. Start dev server: `npm run dev`

## 📝 Development Guidelines

### Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** rules and fix all warnings
- Use **single quotes** for strings
- Use **consistent indentation** (2 spaces)
- Follow **Next.js 15** best practices

### Component Guidelines
- Use **shadcn/ui** components when possible
- Create **Server Components** for data display
- Use **Client Components** only for interactivity
- Implement **proper TypeScript interfaces**
- Add **JSDoc comments** for complex functions

### State Management
- Use **Zustand** for client-side state
- Use **Server Actions** for database operations
- Implement **optimistic updates** for better UX
- Handle **loading states** properly

### Database Guidelines
- Use **Drizzle ORM** for all database operations
- Create **proper migrations** for schema changes
- Update **seed data** when adding new features
- Follow **naming conventions** for tables and columns

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check

# Database
npm run db:start     # Start PostgreSQL
npm run db:stop      # Stop PostgreSQL
npm run db:studio    # Open Drizzle Studio
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Description** of the issue
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Browser/OS** information
- **Console errors** (if any)

## 💡 Feature Requests

When requesting features, please:
- **Describe the feature** clearly
- **Explain the use case**
- **Provide examples** if possible
- **Consider alternatives** that might exist

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly**
   - Run `npm run lint`
   - Run `npm run build`
   - Test the feature manually
   - Update tests if applicable

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Link any related issues
   - Request reviews from maintainers

### Commit Message Format
Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Writing Tests
- Test **user interactions**
- Test **error scenarios**
- Test **edge cases**
- Aim for **high coverage**
- Use **descriptive test names**

## 📚 Documentation

### Updating Documentation
- Keep **README.md** up to date
- Update **API documentation**
- Add **code examples**
- Include **screenshots** for UI changes
- Update **changelog** for releases

### Code Comments
- Add **JSDoc** for public functions
- Explain **complex logic**
- Document **API endpoints**
- Include **usage examples**

## 🚨 Security

### Reporting Security Issues
- **DO NOT** create public issues for security problems
- Email security issues to: security@example.com
- Include **detailed description** of the vulnerability
- Provide **steps to reproduce**
- Wait for **acknowledgment** before public disclosure

## 🎯 Project Roadmap

### Current Focus
- **Performance optimization**
- **Accessibility improvements**
- **Mobile responsiveness**
- **Testing coverage**

### Future Features
- **Real-time collaboration**
- **Advanced filtering**
- **Export functionality**
- **API endpoints**

## 🤝 Community

### Getting Help
- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Discord**: For real-time chat (link in README)

### Code of Conduct
- **Be respectful** to all contributors
- **Welcome newcomers** and help them learn
- **Focus on the code**, not the person
- **Assume good intentions**

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Team Tasks! 🎉

Your contributions help make this project better for everyone.
