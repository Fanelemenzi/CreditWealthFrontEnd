# Deployment Guide

## 🚀 Deploying Your Credit Score Platform

This guide covers deploying your React application to popular hosting platforms.

---

## Build for Production

First, create an optimized production build:

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- Free tier available
- Automatic deployments from Git
- Excellent performance
- Zero configuration for Vite projects

### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deployment**
```bash
vercel --prod
```

### Or Deploy via GitHub:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel auto-detects Vite - just click Deploy!

---

## Option 2: Netlify

### Steps:

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy
```

4. **Production Deployment**
```bash
netlify deploy --prod
```

### Or Deploy via GitHub:
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click Deploy!

---

## Option 3: GitHub Pages

### Steps:

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update vite.config.js**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // Add this line
  server: {
    port: 3000
  }
})
```

3. **Add deploy scripts to package.json**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Save

Your site will be at: `https://yourusername.github.io/your-repo-name/`

---

## Option 4: Firebase Hosting

### Steps:

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase**
```bash
firebase init
```
   - Select "Hosting"
   - Choose existing project or create new one
   - Set public directory to: `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html

4. **Build and Deploy**
```bash
npm run build
firebase deploy
```

---

## Option 5: AWS S3 + CloudFront

### Steps:

1. **Create S3 Bucket**
   - Name: your-domain.com
   - Uncheck "Block all public access"
   - Enable static website hosting

2. **Build the project**
```bash
npm run build
```

3. **Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. **Set Bucket Policy**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}
```

5. **Create CloudFront Distribution** (Optional but recommended)
   - Origin: Your S3 bucket
   - Default Root Object: index.html
   - Error Pages: Point 404 to /index.html (for client-side routing)

---

## Environment Variables

If you need environment variables:

1. **Create `.env` file** (don't commit this!)
```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=CreditScore
```

2. **Access in code**
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

3. **Platform-specific setup:**

**Vercel**: Add in project settings → Environment Variables

**Netlify**: Add in site settings → Environment → Environment variables

**GitHub Pages**: Use GitHub Secrets and Actions

---

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify routing works (try refreshing on /login)
- [ ] Check responsive design on mobile
- [ ] Test form submissions
- [ ] Verify animations work
- [ ] Check console for errors
- [ ] Test on different browsers
- [ ] Verify meta tags and SEO
- [ ] Set up SSL/HTTPS (usually automatic)
- [ ] Configure custom domain (optional)

---

## Custom Domain Setup

### Vercel:
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed

### Netlify:
1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

---

## Continuous Deployment

All the above platforms support automatic deployments:

1. **Connect your Git repository**
2. **Every push to main branch automatically deploys**
3. **Pull requests get preview deployments**

---

## Performance Optimization Tips

Before deploying:

1. **Optimize Images**: Use WebP format
2. **Code Splitting**: Already done by Vite
3. **Lazy Loading**: Add for routes if needed
4. **Compression**: Enable gzip/brotli (most hosts do this)
5. **CDN**: Use platform's CDN (automatic on Vercel/Netlify)

---

## Troubleshooting

### Routes return 404 on refresh
- Add a `_redirects` file (Netlify) or `vercel.json` (Vercel)
- For Netlify, create `public/_redirects`:
```
/*    /index.html   200
```

- For Vercel, create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Build fails
- Check Node version matches your local version
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## Monitor Your Deployment

After deployment:
- Set up analytics (Google Analytics, Plausible)
- Monitor performance (Lighthouse, WebPageTest)
- Set up error tracking (Sentry, LogRocket)
- Check uptime (UptimeRobot, Pingdom)

---

## Cost Estimates

- **Vercel**: Free for hobby projects
- **Netlify**: Free for personal projects (100GB bandwidth)
- **GitHub Pages**: Free (public repos only)
- **Firebase**: Free tier available (10GB storage, 360MB/day transfer)
- **AWS S3 + CloudFront**: ~$1-5/month for small sites

---

## Recommended: Vercel or Netlify

For this project, I recommend **Vercel** or **Netlify**:
- ✅ Free tier sufficient for most use cases
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Zero configuration for Vite
- ✅ Preview deployments for PRs
- ✅ Easy custom domain setup

---

Happy Deploying! 🚀
