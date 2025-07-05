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
- Logging (Pino)
- Typesafe Environment Variables (t3-env)
- Formatting (Prettier)
- Linting (ESLint + SonarQube)
- A+ Security Headers (CSP with Nonce)

# Project Structure

```
vectorize-web/
├── src/
│   ├── app/                # Next.js app directory (routing, pages, global styles)
│   ├── components/         # Reusable UI components (buttons, cards, dialogs, etc.)
│   │   └── ui/             # Atomic UI primitives (badge, button, card, etc.)
│   ├── features/           # Main feature modules (dataset, model, evaluation, training)
│   │   ├── dataset/        # Dataset data
│   │   ├── evaluation/     # Evaluation data
│   │   ├── model/          # Model data
│   │   ├── service-starter/# Multi-step workflow for training/evaluation services
│   │   ├── shared/         # Shared providers and context
│   │   ├── sidebar/        # Sidebar UI and synthetic data workflows
│   │   ├── synthetic/      # Synthetic data generation dialogs and hooks
│   │   ├── tasks/          # Task management, filtering, and status cards
│   │   ├── theme/          # Theme toggling and related UI
│   │   └── training/       # Training data
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions, API clients, logging, etc.
│   ├── types/              # Shared TypeScript types
│   └── config/             # App-wide configuration (CSP, site config)
├── public/                 # Static assets (images, favicon, public data)
├── resources/              # External configs (e.g., SonarQube, Docker)
├── scripts/                # Automation and utility scripts
├── tests/                  # End-to-end and integration tests
├── Dockerfile              # Docker build instructions
├── package.json            # Project metadata and dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
```

## Contributors

We're grateful to all the talented individuals who have contributed to Vectorize:

<table>
<tr>
  <td align="center">
    <a href="https://github.com/Dosto1ewski">
      <img src="https://avatars.githubusercontent.com/Dosto1ewski" width="80" style="border-radius: 50%;" alt="Anselm Böhm"/>
      <br />
      <sub><b>Anselm Böhm</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/BtnCbn">
      <img src="https://avatars.githubusercontent.com/BtnCbn" width="80" style="border-radius: 50%;" alt="Botan Coban"/>
      <br />
      <sub><b>Botan Coban</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/yukasama">
      <img src="https://avatars.githubusercontent.com/yukasama" width="80" style="border-radius: 50%;" alt="Yukasama"/>
      <br />
      <sub><b>Yukasama</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/domoar">
      <img src="https://avatars.githubusercontent.com/domoar" width="80" style="border-radius: 50%;" alt="Manuel Dausmann"/>
      <br />
      <sub><b>Manuel Dausmann</b></sub>
    </a>
  </td>
  <td align="center">
    <a href="https://github.com/Yannjc">
      <img src="https://avatars.githubusercontent.com/Yannjc" width="80" style="border-radius: 50%;" alt="Yannic Jahnke"/>
      <br />
      <sub><b>Yannic Jahnke</b></sub>
    </a>
  </td>
</tr>
</table>
