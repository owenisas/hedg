# Polyhedg Clone

A Next.js clone of the [polyhedg.com](https://www.polyhedg.com/) website.

## 🚀 Live Demo

Visit the live demo at: [https://owenisas.github.io/hedg/](https://owenisas.github.io/hedg/)

## Features

- Responsive design with Tailwind CSS
- Sidebar navigation with hedge management
- Chat interface with example prompts
- Mobile-friendly layout
- Static export for GitHub Pages deployment

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is configured for automatic deployment to GitHub Pages. On every push to the `main` branch, GitHub Actions will:

1. Build the Next.js static export
2. Deploy to GitHub Pages

### Manual Deployment Setup

If you're setting this up for the first time:

1. Go to your repository Settings → Pages
2. Under "Build and deployment", set Source to "GitHub Actions"
3. The workflow will automatically run on the next push to `main`

### Local Build

To build the static export locally:

```bash
npm run build
```

The output will be in the `out/` directory.

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `src/components/` - React components
- `src/lib/` - Shared utilities, types, and mock data
- `src/services/` - API and agent services
- `src/app/globals.css` - Global styles and Tailwind CSS configuration
- `public/` - Static assets (images, favicon)
- `.github/workflows/` - GitHub Actions deployment workflow

## Configuration

The project uses the following configuration for GitHub Pages:

- **Base Path**: `/hedg` (configured in `next.config.js`)
- **Static Export**: Enabled via `output: 'export'`
- **Image Optimization**: Disabled for static export compatibility

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [GitHub Pages Documentation](https://docs.github.com/pages) - learn about GitHub Pages deployment.