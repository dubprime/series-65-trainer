# 🚀 Vercel Deployment Guide

## Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [GitHub Repository](https://github.com) (or GitLab/Bitbucket)
- [Supabase Project](https://supabase.com) (for production database)

## 🏗️ Local Build Test

Before deploying, test the build locally:

```bash
# Install dependencies
pnpm install

# Run type checking
pnpm run type-check

# Run linting
pnpm run lint

# Build the application
pnpm run build

# Test production build locally
pnpm run start
```

## 🌐 Vercel Deployment

### 1. **Connect Repository**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the repository containing this project

### 2. **Configure Build Settings**

Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 3. **Environment Variables**

Set these environment variables in Vercel:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key

# Optional
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. **Deploy**

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🗄️ Supabase Production Setup

### 1. **Create Production Project**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note down the URL and API keys

### 2. **Run Migrations**

```bash
# Set production environment
export SUPABASE_URL=your_production_supabase_url
export SUPABASE_ANON_KEY=your_production_supabase_anon_key
export SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key

# Run migrations
supabase db push
```

### 3. **Import Questions**

```bash
# Import your parsed questions
pnpm run import:questions
```

## 🔧 Post-Deployment

### 1. **Verify Functionality**

- [ ] Authentication works
- [ ] Questions load properly
- [ ] User progress saves
- [ ] All pages render correctly

### 2. **Performance Monitoring**

- [ ] Check Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Test on mobile devices

### 3. **Security**

- [ ] Verify environment variables are set
- [ ] Check Supabase RLS policies
- [ ] Test authentication flows

## 🚨 Troubleshooting

### Build Failures

```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

### Runtime Errors

```bash
# Check Vercel function logs
# Verify Supabase connection
# Test environment variables
```

### Performance Issues

```bash
# Enable Vercel Analytics
# Check bundle size with build:analyze
# Optimize images and assets
```

## 📱 Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records
5. Enable HTTPS

## 🔄 Continuous Deployment

- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

## 📊 Monitoring

- **Vercel Analytics**: Performance metrics
- **Vercel Logs**: Function execution logs
- **Supabase Dashboard**: Database monitoring
- **Error Tracking**: Consider adding Sentry

## 🎯 Next Steps

1. **Set up monitoring** for production
2. **Configure backups** for Supabase
3. **Set up alerts** for critical errors
4. **Plan scaling** strategy
5. **Document** deployment procedures

---

**Need Help?** Check [Vercel Documentation](https://vercel.com/docs) or [Supabase Docs](https://supabase.com/docs)
