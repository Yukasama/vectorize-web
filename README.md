# Nextjs Template

## Installation Steps

### 1. Install packages

```bash
pnpm i
```

### 2. Start server

```bash
pnpm run dev
```

### Build Docker Image

```bash
docker build -t vectorize_web:0.1.0 .
```

## Features

- Next.js 15
- Tailwind v4
- Dark Theme (next-themes)
- End-To-End Tests (Playwright)
- Logging (Pino)
- Typesafe Environment Variables (t3-env)
- Formatting (Prettier)
- Linting (ESLint + SonarQube)
- A+ Security Headers (CSP with Nonce)
