# Netlify Deployment Guide for SufgaVote

## Prerequisites
1. A Netlify account (sign up at https://netlify.com)
2. Your backend API deployed somewhere (Render, Railway, Heroku, etc.)

## Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Netlify site**:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Choose a site name (e.g., `sufgavote`)
   - Build command: `npm run build`
   - Directory to deploy: `frontend/build`

4. **Set Environment Variables**:
   ```bash
   netlify env:set REACT_APP_API_URL "https://your-backend-api.com/api"
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify Dashboard

1. **Connect to GitHub**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your `SufgaVote` repository

2. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Node version**: 18

3. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add:
     - Key: `REACT_APP_API_URL`
     - Value: `https://your-backend-api.com/api`

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete

### Option 3: Manual Deploy

1. **Build the frontend locally**:
   ```bash
   cd frontend
   REACT_APP_API_URL=https://your-backend-api.com/api npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   cd build
   netlify deploy --prod
   ```

## Backend Deployment (Required First!)

Before deploying the frontend, deploy your backend API. Here are some options:

### Option A: Deploy to Render.com (Recommended - Free Tier Available)

1. Go to https://render.com
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A random secret key
     - `ADMIN_USERNAME`: Your admin username
     - `ADMIN_PASSWORD`: Your admin password
     - `PORT`: 3001 (or leave blank, Render assigns automatically)

### Option B: Deploy to Railway.app

1. Go to https://railway.app
2. Create new project from GitHub
3. Select the `backend` directory
4. Add environment variables (same as above)
5. Railway will auto-detect Node.js and deploy

### Option C: Deploy to Heroku

1. Install Heroku CLI
2. ```bash
   cd backend
   heroku create sufgavote-api
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-secret"
   git push heroku main
   ```

## Important Configuration

### Update API URL in Frontend

After deploying your backend, update the `REACT_APP_API_URL` environment variable in Netlify:

1. Go to Site settings → Environment variables
2. Update `REACT_APP_API_URL` to your backend URL
3. Redeploy the site

### CORS Configuration

Make sure your backend allows requests from your Netlify domain. In your backend, update CORS settings:

```javascript
// backend/src/server.js
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-netlify-site.netlify.app', // Add your Netlify URL
];
```

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## Continuous Deployment

Netlify automatically deploys when you push to GitHub:
- Push to `main` branch → Automatic production deployment
- Create pull request → Automatic preview deployment

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://api.sufgavote.com/api` |

## Troubleshooting

### Build fails with "Command not found"
- Ensure Node version is set to 18 in Netlify settings

### API calls fail with CORS errors
- Check backend CORS configuration includes Netlify URL
- Verify `REACT_APP_API_URL` is correct

### Routes return 404
- The `netlify.toml` file handles this with SPA redirects
- If missing, create it in the root directory

### Images not loading
- Ensure backend static files are served correctly
- Check image URLs are using the backend API URL

## Testing Your Deployment

1. Visit your Netlify URL
2. Test login functionality
3. Test voting features
4. Check admin dashboard
5. Verify countdown timer
6. Test on mobile devices

## Cost Considerations

- **Netlify**: Free tier includes 100GB bandwidth/month
- **Backend (Render)**: Free tier with 750 hours/month
- **MongoDB Atlas**: Free tier M0 cluster (512MB storage)

Total monthly cost: **$0** on free tiers! 🎉

## Next Steps

1. Deploy backend first
2. Note the backend URL
3. Deploy frontend with correct API URL
4. Test thoroughly
5. Consider adding a custom domain
6. Set up monitoring and analytics
