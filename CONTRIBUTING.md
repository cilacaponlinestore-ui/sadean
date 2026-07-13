# Contributing to SADEAN

Thank you for your interest in contributing to SADEAN! This document provides guidelines and information about contributing to this project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

---

## Code of Conduct

Please be respectful and inclusive in all interactions. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community

---

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm 8+
- Docker & Docker Compose
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/sadean.git
   cd sadean
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/sadean.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Setup environment:
   ```bash
   cp .env.example .env
   ```

6. Start development:
   ```bash
   npm run docker:up
   npm run dev
   ```

---

## Development Process

### 1. Create a Branch

Always create a branch from `develop`:

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write your code following the coding standards
- Add tests if applicable
- Update documentation if needed

### 3. Commit Changes

Follow the commit convention:

```bash
git commit -m "feat: Add new feature"
```

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

Create a PR to the `develop` branch with:
- Clear title and description
- Reference to related issues
- Screenshots if UI changes

---

## Branch Strategy

### Branch Types

| Branch | Purpose | Example |
|--------|---------|---------|
| `main` | Production code | - |
| `develop` | Development integration | - |
| `feature/*` | New features | `feature/user-auth` |
| `bugfix/*` | Bug fixes | `bugfix/fix-login` |
| `hotfix/*` | Critical production fixes | `hotfix/security-patch` |
| `release/*` | Release preparation | `release/v1.0.0` |

### Branch Naming

```
feature/user-authentication
bugfix/fix-cart-calculation
hotfix/security-vulnerability
release/v1.0.0
```

---

## Commit Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add login` |
| `fix` | Bug fix | `fix(cart): fix total calculation` |
| `refactor` | Code refactoring | `refactor(api): optimize queries` |
| `docs` | Documentation | `docs: update README` |
| `style` | Code style | `style: format code` |
| `test` | Tests | `test: add unit tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance | `perf: optimize images` |

### Examples

```bash
feat(auth): implement JWT authentication
fix(orders): resolve duplicate order issue
docs(api): update API documentation
refactor(products): improve search performance
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows coding standards
- [ ] Tests pass locally
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Documentation updated (if applicable)
- [ ] Branch is up to date with `develop`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. PR will be automatically checked by CI/CD
2. At least one review required
3. Address review comments
4. Squash and merge after approval

---

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` type
- Use interfaces for object shapes
- Use enums for constants

### Naming Conventions

```typescript
// Variables and functions: camelCase
const userName = 'John';
function getUser() {}

// Classes: PascalCase
class UserService {}

// Constants: UPPER_SNAKE_CASE
const API_URL = 'http://localhost:3001';

// Files: kebab-case
user-service.ts
auth.controller.ts
```

### Import Order

```typescript
// 1. External packages
import { useState } from 'react';
import { Router } from 'next/router';

// 2. Internal packages
import { Button } from '@sadean/ui';
import { User } from '@sadean/types';

// 3. Local imports
import { UserService } from './user.service';
import { styles } from './styles';
```

### File Structure

```
src/
├── modules/           # Feature modules
│   └── feature/
│       ├── dto/       # Data transfer objects
│       ├── guards/    # Auth guards
│       ├── *.module.ts
│       *.controller.ts
│       *.service.ts
│       *.spec.ts
├── common/           # Shared utilities
├── config/           # Configuration
└── main.ts           # Entry point
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- --testPathPattern=user.service

# Run with coverage
npm run test:coverage
```

### Writing Tests

```typescript
describe('UserService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const dto = { email: 'test@example.com' };

      // Act
      const result = await service.create(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(dto.email);
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const dto = { email: 'existing@example.com' };

      // Act & Assert
      await expect(service.create(dto)).rejects.toThrow();
    });
  });
});
```

---

## Questions?

If you have questions, feel free to:

1. Open a discussion
2. Contact the team
3. Check the documentation

Thank you for contributing to SADEAN! 🎉