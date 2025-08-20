# Deployment Guide for Series 65 Training App/Game  
**Stack:** Vercel + Supabase  

---

## Overview  
This document outlines the deployment process for the Series 65 Training App/Game using Vercel for frontend hosting and Supabase for backend services including the database, authentication, and edge functions.  

---

## Environments  
We maintain three primary environments:  
- **Development**: Local development and feature branches.  
- **Staging**: Pre-production testing environment.  
- **Production**: Live environment for end users.  

Each environment has its own Supabase project and Vercel deployment.  

---

## Environment Variables  
Set environment variables in Vercel dashboard for each environment:  
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key  
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (only in server environment)  
- `DATABASE_URL` - Database connection string (used for migrations)  
- `NEXT_PUBLIC_VERCEL_ENV` - Vercel environment identifier (dev, preview, production)  

Example in Vercel CLI:  
```bash  
vercel env add NEXT_PUBLIC_SUPABASE_URL production  
vercel env add SUPABASE_SERVICE_ROLE_KEY preview  
```  

---

## Secrets  
Store sensitive keys and tokens in Vercel and Supabase secrets manager. Avoid committing secrets to git. Use:  
```bash  
vercel secrets add supabase-service-role-key <your-service-role-key>  
```  
Reference secrets in environment variables as needed.  

---

## Supabase Migrations Workflow  
1. Develop migrations locally using Supabase CLI:  
```bash  
supabase db diff --schema public > migrations/20240601_add_users_table.sql  
```  
2. Apply migrations locally for testing:  
```bash  
supabase db push  
```  
3. Commit migration files to GitHub.  
4. In CI/CD pipeline, run:  
```bash  
supabase db reset --force # for testing environments only  
supabase db push --project-ref $SUPABASE_PROJECT_REF --schema public  
```  

---

## Vercel Build Settings  
- **Build Command:** `npm run build`  
- **Output Directory:** `.next`  
- **Install Command:** `npm install`  
- **Framework Preset:** Next.js  

Set these in the Vercel project settings or `vercel.json` as needed.  

---

## CI/CD with GitHub Actions  
Sample workflow `.github/workflows/deploy.yml`:  
```yaml  
name: Deploy Series 65 App  

on:  
  push:  
    branches:  
      - main  
      - staging  

jobs:  
  build-and-deploy:  
    runs-on: ubuntu-latest  
    steps:  
      - uses: actions/checkout@v3  

      - name: Setup Node.js  
        uses: actions/setup-node@v3  
        with:  
          node-version: '18'  

      - name: Install dependencies  
        run: npm install  

      - name: Run Supabase migrations  
        env:  
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}  
          SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}  
        run: |  
          npx supabase db push --project-ref $SUPABASE_PROJECT_REF --schema public  

      - name: Build Next.js app  
        run: npm run build  

      - name: Deploy to Vercel  
        uses: amondnet/vercel-action@v20  
        with:  
          vercel-token: ${{ secrets.VERCEL_TOKEN }}  
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}  
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}  
          working-directory: ./  
          vercel-args: '--prod'  
```  

---

## Database Backups and Restore  
- Use Supabase Studio or CLI to export database:  
```bash  
pg_dump $DATABASE_URL > backup_$(date +%F).sql  
```  
- To restore:  
```bash  
psql $DATABASE_URL < backup_2024-06-01.sql  
```  
- Automate daily backups using Supabase scheduled functions or cron jobs on your infrastructure.  

---

## Rollback Playbook  
- Identify last known good migration.  
- Revert database schema by applying rollback migrations or restoring backup.  
- Redeploy previous stable Vercel deployment via dashboard or CLI:  
```bash  
vercel rollback <deployment-url>  
```  
- Notify team and monitor for issues.  

---

## Seeding and Fixtures  
- Maintain seed SQL or JS scripts in `prisma/seed.js` or `scripts/seed.sql`.  
- Run locally or in CI:  
```bash  
psql $DATABASE_URL -f scripts/seed.sql  
```  
or  
```bash  
node prisma/seed.js  
```  

---

## Edge Functions and Cron  
- Deploy edge functions via Supabase CLI:  
```bash  
supabase functions deploy <function-name> --project-ref $SUPABASE_PROJECT_REF  
```  
- Schedule cron jobs using Supabase scheduled functions or external schedulers (GitHub Actions, cron-job.org).  

---

## Monitoring and Observability  
- Use Vercel Analytics for frontend performance.  
- Use Supabase Logs and Metrics dashboard.  
- Integrate Sentry or LogRocket for error tracking.  
- Monitor database performance using Supabase or third-party tools.  

---

## Feature Flags  
- Use environment variables or a feature flag service (e.g., LaunchDarkly).  
- Control rollout of new features by toggling flags in Vercel environment variables or remote config.  

---

## Performance and Caching  
- Use Next.js ISR (Incremental Static Regeneration) for caching pages.  
- Cache API responses at edge using Vercel edge functions or CDN headers.  
- Optimize images with Next.js Image component.  

---

## Domain and SSL  
- Configure custom domain in Vercel dashboard.  
- Vercel provides automatic SSL via Let's Encrypt.  
- Update DNS records to point to Vercel as per instructions in dashboard.  

---

## Post-Deployment Checklist  
- Verify environment variables are correctly set.  
- Confirm migrations applied successfully.  
- Validate frontend deployment and routing.  
- Run smoke tests on critical flows.  
- Check database connectivity and authentication.  
- Monitor logs for errors or warnings.  
- Announce deployment to stakeholders.  

---

This guide should be reviewed and updated regularly to reflect changes in the deployment process or infrastructure.
