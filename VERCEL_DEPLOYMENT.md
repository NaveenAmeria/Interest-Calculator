# 🚀 Vercel Deployment Guide

## Overview

Your Interest Calculator is configured to deploy on Vercel as **two separate projects**:
- **Frontend** (Client - React/Vite)
- **Backend** (Server - Node.js/Express)

---

## 📦 Step 1: Deploy Backend First

### A. Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**

### B. Import Repository
1. Select **Interest-Calculator** repository
2. Configure deployment:
   ```
   Project Name: interest-calculator-api
   Root Directory: server
   Framework Preset: Other
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: npm install
   ```

### C. Add Environment Variables
Click **Environment Variables** and add these:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET=your-bucket-name
S3_PUBLIC_BASE_URL=https://your-bucket.s3.region.amazonaws.com
APP_TZ=Asia/Kolkata
```

> **Important**: Use your actual MongoDB Atlas URL, JWT secret, and AWS credentials

### D. Deploy
1. Click **Deploy**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://interest-calculator-api.vercel.app`)

---

## 🎨 Step 2: Deploy Frontend

### A. Create New Project
1. In Vercel, click **"New Project"** again
2. Select **Interest-Calculator** repository again

### B. Configure Frontend
```
Project Name: interest-calculator-app
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### C. Add Environment Variable
Add this environment variable:

```
VITE_API_URL=https://interest-calculator-api.vercel.app
```

> Replace with YOUR actual backend URL from Step 1

### D. Deploy
1. Click **Deploy**
2. Wait for deployment
3. Your app will be live at: `https://interest-calculator-app.vercel.app`

---

## ✅ Verification

After deployment:

1. **Backend Health Check**:
   - Visit: `https://your-backend-url.vercel.app/health`
   - Should return: `{"ok": true}`

2. **Frontend**:
   - Visit your frontend URL
   - Try to register/login
   - Check browser console for errors

---

## 🔧 Post-Deployment Configuration

### Update CORS in Backend
The backend needs to allow requests from your frontend URL.

**In Vercel Backend Environment Variables**, update:
```
CORS_ORIGIN=https://interest-calculator-app.vercel.app
```

Or for multiple origins, update `server/src/index.js` to allow both local and production:
```javascript
app.use(cors({ 
  origin: [
    process.env.CORS_ORIGIN,
    'https://interest-calculator-app.vercel.app'
  ], 
  credentials: true 
}));
```

---

## 📝 Important Notes

### MongoDB
- Use **MongoDB Atlas** (cloud database)
- Whitelist Vercel IPs or use `0.0.0.0/0` (allow all)
- Get connection string from MongoDB Atlas dashboard

### AWS S3
- File uploads won't work without proper AWS credentials
- Configure bucket permissions for public read

### Environment Variables
- Never commit `.env` files
- Always use Vercel dashboard to set production variables
- Update `.env.production` locally for testing

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will auto-deploy both frontend and backend
```

---

## 🌐 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://interest-calculator-app.vercel.app`
- **Backend API**: `https://interest-calculator-api.vercel.app`
- **Health Check**: `https://interest-calculator-api.vercel.app/health`

---

## 🚨 Troubleshooting

### "Cannot connect to API"
- Check `VITE_API_URL` in frontend environment variables
- Verify backend is deployed and health check works
- Check CORS configuration

### "Database connection failed"
- Verify `MONGO_URI` in backend environment variables
- Check MongoDB Atlas network access (whitelist IPs)
- Ensure database user has correct permissions

### "Build failed"
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

---

## ✨ Quick Deploy Checklist

- [ ] Backend deployed with all environment variables
- [ ] Backend health check returns `{"ok": true}`
- [ ] Frontend deployed with `VITE_API_URL` set
- [ ] CORS configured to allow frontend URL
- [ ] MongoDB Atlas accessible from Vercel
- [ ] Test registration/login works
- [ ] Test creating accounts/transactions

**You're all set!** 🎉
