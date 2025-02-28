# Cerrado Diagram Project Guide

## Commands

You don't need to run the commands below. The user you run manually, they are just for reference.

- `pnpm dev` - Start dev server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint

## Code Style Guidelines

- **TypeScript**: Strict typing enabled, use proper type annotations
- **Imports**: Use absolute imports with `@/` prefix (e.g., `@/components/ui/button`)
- **Components**:
  - React Server Components by default
  - Use shadcn/ui component patterns with Tailwind CSS
  - Prefer function declarations over arrow functions for components
- **Naming**:
  - PascalCase for components and types
  - camelCase for functions, variables, and props
- **CSS**: Use Tailwind with class-variance-authority for component variants
- **Utils**: Use `cn()` for merging Tailwind classes
- **File Structure**: Follow Next.js App Router conventions
