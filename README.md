# StockLens

StockLens is a `Next.js` frontend prototype for an interactive Indian market dashboard with sample real-time data.

## Local development

```bash
pnpm install
pnpm dev
```

App runs locally at [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

### Option 1: GitHub + Vercel

1. Initialize git in this folder:

```bash
git init
git add .
git commit -m "Initial StockLens frontend"
```

2. Create a GitHub repository and push:

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

3. In Vercel:
   - Open [https://vercel.com](https://vercel.com)
   - Click **Add New** → **Project**
   - Import your GitHub repo
   - Let Vercel auto-detect `Next.js`
   - Deploy

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Environment variables

This project currently uses sample frontend data and does not require production environment variables by default.

