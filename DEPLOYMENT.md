# SufgaVote Deployment Guide - Render + Netlify + MongoDB

**Recommended Setup**: MongoDB Atlas (database) + Render (backend) + Netlify (frontend)

This guide provides step-by-step instructions to deploy your SufgaVote application completely for free!

## 📋 Prerequisites

1. ✅ GitHub account with your SufgaVote repository
2. ✅ MongoDB Atlas account (free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
3. ✅ Render account (free tier) - [Sign up here](https://render.com)
4. ✅ Netlify account (free tier) - [Sign up here](https://netlify.com)

---

## Part 1: MongoDB Atlas Setup (5 minutes)

### Step 1: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Build a Database"** → Choose **"M0 FREE"** tier
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create Cluster"**

### Step 2: Configure Database Access

1. **Create Database User**:
   - Go to **Database Access** (left sidebar)
   - Click **"Add New Database User"**
   - Username: `sufgavote_admin` (or anything you want)
   - Password: Click **"Autogenerate Secure Password"** → **SAVE THIS PASSWORD!**
   - Database User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

2. **Whitelist IP Addresses**:
   - Go to **Network Access** (left sidebar)
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**

### Step 3: Get Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://sufgavote_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Replace `<password>`** with your actual password
5. **Add database name** to the connection string:
   ```
   mongodb+srv://sufgavote_admin:YourPassword@cluster0.xxxxx.mongodb.net/sufgavote?retryWrites=true&w=majority
   ```
6. **SAVE THIS CONNECTION STRING** - you'll need it for Render!

---

## Part 2: Backend Deployment to Render (10 minutes)

### Step 1: Create Render Account & Connect GitHub

1. Go to [Render.com](https://render.com) → Sign up with GitHub
2. Authorize Render to access your GitHub account

### Step 2: Create Web Service

1. On Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: **SufgaVote**
3. Click **"Connect"**

### Step 3: Configure Build Settings

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `sufgavote-api` (or any name you want) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### Step 4: Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** for each:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/sufgavote` |
| `JWT_SECRET` | Any random secure string (at least 32 characters) | `your-super-secret-jwt-key-change-this-12345` |
| `ADMIN_USERNAME` | Your desired admin username | `admin` |
| `ADMIN_PASSWORD` | Your desired admin password | `SecureAdminPass123!` |
| `PORT` | `3001` | `3001` |
| `FRONTEND_URL` | Leave blank for now, will add after Netlify | (will add later) |

**Important Notes**:
- Save your `ADMIN_USERNAME` and `ADMIN_PASSWORD` somewhere safe - you'll need these to login!
- Keep the `JWT_SECRET` secure and random (at least 32 characters)

### Step 5: Deploy Backend!

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment (watch the build logs)
3. Once deployed, you'll see: ✅ **"Live"** with a green indicator
4. **COPY YOUR BACKEND URL** - it will look like: `https://sufgavote-api.onrender.com`

### Step 6: Test Backend

Open your backend URL in browser: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{"status":"OK","timestamp":"2025-01-21T..."}
```

✅ **Backend is live!**

> **Note about Free Tier Spindown**: Render free tier spins down after 15 minutes of inactivity. Before your voting event starts, open your backend URL to wake it up (takes ~30 seconds). Keep the admin dashboard open during the event to maintain activity.

---

## Part 3: Frontend Deployment to Netlify (10 minutes)

### Step 1: Create Netlify Account

1. Go to [Netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Deploy Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your **SufgaVote** repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/build` |
| **Production branch** | `main` |

### Step 3: Set Environment Variables

Before deploying, click **"Show advanced"** → **"New variable"**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-render-backend.onrender.com/api` |
| `NODE_VERSION` | `18` |

**IMPORTANT**: Replace `your-render-backend.onrender.com` with YOUR actual Render URL from Part 2!

**Example**:
```
REACT_APP_API_URL=https://sufgavote-api.onrender.com/api
```

Make sure to include `/api` at the end!

### Step 4: Deploy Frontend!

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build to complete (watch the deploy logs)
3. You'll get a random URL like: `https://random-name-12345.netlify.app`

### Step 5: Customize Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change to something like: `sufgavote` → Get URL: `https://sufgavote.netlify.app`

✅ **Frontend is live!**

---

## Part 4: Configure CORS (IMPORTANT!)

Now that you have your Netlify URL, you need to tell your backend to accept requests from it.

### Update Backend Environment Variable

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your **sufgavote-api** service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` (or add it if you skipped it earlier)
5. Set it to your Netlify URL:
   ```
   https://your-site-name.netlify.app
   ```
6. Click **"Save Changes"**
7. Your backend will automatically redeploy (takes 1-2 minutes)

**Important**: Don't include `/api` or trailing slash in `FRONTEND_URL`!

✅ **CORS configured!**

---

## Part 5: Test Your Deployment! 🎉

### 1. Open Your Netlify Site

Visit: `https://your-site-name.netlify.app`

### 2. Login as Admin

1. Click **"Admin Login"**
2. Use the credentials you set in Render (`ADMIN_USERNAME` and `ADMIN_PASSWORD`)
3. You should see the admin dashboard!

### 3. Create Test Couple

1. Click **"Couples"** tab
2. Click **"Add Couple"**
3. Create a test couple with:
   - Couple name: `Test Couple`
   - Password: `test123`
4. Click **"Create"**

### 4. Test Couple Login

1. Logout (or open incognito window)
2. Go to your Netlify site
3. Login as the test couple
4. You should see the voting dashboard!

### 5. Create Sufgania (Optional)

1. Login as admin
2. Go to **"Sufganiot"** tab
3. Create a test sufgania
4. Upload a photo
5. Check if the couple can see it in voting page!

---

## 🎯 Quick Reference

### URLs to Bookmark

- **Frontend (Netlify)**: `https://your-site-name.netlify.app`
- **Backend (Render)**: `https://your-backend.onrender.com`
- **MongoDB**: https://cloud.mongodb.com

### Admin Credentials

- Username: (what you set in `ADMIN_USERNAME`)
- Password: (what you set in `ADMIN_PASSWORD`)

### Environment Variables Summary

**Render (Backend)**:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password
PORT=3001
FRONTEND_URL=https://your-netlify-site.netlify.app
```

**Netlify (Frontend)**:
```env
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
NODE_VERSION=18
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check Render build logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend shows "Network Error"
- Check if `REACT_APP_API_URL` is correct in Netlify
- Make sure it ends with `/api`
- Verify `FRONTEND_URL` is set correctly in Render
- Wait for backend to wake up if it was sleeping (~30 seconds)

### CORS Errors
- Double-check `FRONTEND_URL` in Render matches your Netlify URL exactly
- No trailing slashes!
- Backend needs to redeploy after changing env vars

### Images not loading
- Check if images uploaded successfully in admin panel
- Verify backend URL is correct
- Images are stored in Render's ephemeral filesystem (will persist during uptime)

### Login fails
- Check credentials match what's in Render environment variables
- Check browser console for errors
- Verify backend is awake and responding

---

## 💡 Tips for Voting Event Day

### Before Event Starts (30 minutes prior):

1. **Wake up your backend**:
   - Open `https://your-backend.onrender.com/api/health` in browser
   - Wait 30 seconds for it to wake up
   - You should see: `{"status":"OK",...}`

2. **Test everything**:
   - Admin login ✓
   - Couple login ✓
   - Voting page loads ✓
   - Images display ✓

3. **Keep admin dashboard open**:
   - This generates activity and prevents spindown
   - Monitor live activity feed during event

### During Event:

- Admin dashboard will keep backend alive with activity feed polling
- If you notice slowness, check if backend spun down
- Can open backend URL to wake it up again if needed

### After Event:

- Results stay in MongoDB (permanent)
- Can close voting in admin panel
- Publish results when ready
- Can pause/delete Render service to save resources until next year

---

## 🚀 Continuous Deployment

Both Render and Netlify are connected to your GitHub repository:

- **Push to `main` branch** → Automatic deployment to production
- **Create pull request** → Netlify creates preview deployment
- Changes take 2-5 minutes to deploy

---

## 💰 Cost Breakdown

- **MongoDB Atlas (M0 Free)**: $0/month ✓
- **Render (Free Tier)**: $0/month ✓
- **Netlify (Free Tier)**: $0/month ✓

**Total: $0/month!** 🎉

Free tier limitations:
- MongoDB: 512MB storage, 100 connections
- Render: Spins down after 15 min inactivity, 750 hours/month
- Netlify: 100GB bandwidth, 300 build minutes/month

Perfect for a voting event with ~50-100 participants!

---

## 📚 Deployment Checklist

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Netlify
3. ✅ Configure CORS
4. ✅ Test everything
5. Create real couples and sufganiot
6. Set voting end time
7. Announce to participants!
8. Monitor live activity during event
9. Close voting when time's up
10. Review and publish results

---

## 🆘 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Look at Render/Netlify deployment logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

Good luck with your SufgaVote event! 🍩✨

---

# Alternative Deployment Options

The following are alternative deployment options if you prefer other platforms:

## Option A: Railway

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create New Project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your SufgaVote repository

3. **Add PostgreSQL Database**
   - In your Railway project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will create a database and set DATABASE_URL automatically

4. **Deploy Backend**
   - Click "+ New" → "GitHub Repo"
   - Select your repository
   - Set Root Directory: `backend`
   - Add environment variables:
     ```
     NODE_ENV=production
     JWT_SECRET=<generate-strong-secret>
     ADMIN_PASSWORD=<your-secure-password>
     UPLOAD_DIR=./uploads
     FRONTEND_URL=https://your-frontend-url.up.railway.app
     ```
   - Railway will auto-detect and deploy

5. **Deploy Frontend**
   - Click "+ New" → "GitHub Repo" again
   - Select your repository
   - Set Root Directory: `frontend`
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-backend-url.up.railway.app/api
     ```
   - Railway will build and deploy

6. **Update CORS**
   - Go back to backend service
   - Update `FRONTEND_URL` with actual frontend URL

7. **Done!**
   - Access your app at the frontend URL
   - Use your `ADMIN_PASSWORD` to login

### Railway Tips
- Free tier: 500 hours/month (enough for most events)
- Automatic HTTPS
- Auto-redeploy on git push
- Easy environment variable management

---

## Option 2: Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Backend Deployment

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create App**
   ```bash
   cd backend
   heroku create sufgavote-api
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set ADMIN_PASSWORD=your-password
   heroku config:set FRONTEND_URL=https://sufgavote-frontend.herokuapp.com
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

### Frontend Deployment

1. **Create Heroku App**
   ```bash
   cd ../frontend
   heroku create sufgavote-frontend
   ```

2. **Add Buildpack**
   ```bash
   heroku buildpacks:set mars/create-react-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set REACT_APP_API_URL=https://sufgavote-api.herokuapp.com/api
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Option 3: Render

### Backend Deployment

1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - Name: `sufgavote-api`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`

2. **Add PostgreSQL**
   - Click "New +" → "PostgreSQL"
   - Name: `sufgavote-db`
   - Copy the Internal Database URL

3. **Environment Variables**
   ```
   DATABASE_URL=<internal-database-url>
   NODE_ENV=production
   JWT_SECRET=<generate-secret>
   ADMIN_PASSWORD=<your-password>
   FRONTEND_URL=https://sufgavote.onrender.com
   ```

4. **Deploy** - Render auto-deploys

### Frontend Deployment

1. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect repository
   - Settings:
     - Name: `sufgavote`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `build`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://sufgavote-api.onrender.com/api
   ```

3. **Deploy** - Render auto-deploys

---

## Option 4: DigitalOcean App Platform

### Steps

1. **Create New App**
   - Go to DigitalOcean
   - Click "Create" → "Apps"
   - Connect GitHub repository

2. **Configure Backend**
   - Detect `backend` directory
   - Runtime: Node.js
   - Build Command: `npm install`
   - Run Command: `npm start`

3. **Add Database**
   - Add PostgreSQL component
   - Auto-connects via DATABASE_URL

4. **Configure Frontend**
   - Detect `frontend` directory
   - Build Command: `npm install && npm run build`
   - Output Directory: `build`

5. **Set Environment Variables**
   - Backend: `JWT_SECRET`, `ADMIN_PASSWORD`, `FRONTEND_URL`
   - Frontend: `REACT_APP_API_URL`

6. **Deploy** - Auto-deploys on push

---

## Option 5: Custom VPS (Advanced)

For AWS EC2, Google Cloud, or any VPS.

### Requirements
- Ubuntu 20.04+ server
- Domain name (optional but recommended)

### Setup

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib

   # Install Nginx
   sudo apt install -y nginx

   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

2. **Setup Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE sufgavote;
   CREATE USER sufgavote_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE sufgavote TO sufgavote_user;
   \q
   ```

3. **Clone and Setup App**
   ```bash
   cd /var/www
   git clone <your-repo> sufgavote
   cd sufgavote

   # Backend
   cd backend
   npm install --production
   cp .env.example .env
   # Edit .env with production values

   # Frontend
   cd ../frontend
   npm install
   npm run build
   ```

4. **Start Backend with PM2**
   ```bash
   cd ../backend
   pm2 start src/server.js --name sufgavote-api
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/sufgavote
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       # Frontend
       location / {
           root /var/www/sufgavote/frontend/build;
           try_files $uri /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Uploaded files
       location /uploads {
           proxy_pass http://localhost:3001/uploads;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/sufgavote /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL (Optional but Recommended)**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

7. **Setup Firewall**
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow ssh
   sudo ufw enable
   ```

---

## Environment Variables Reference

### Backend
```env
# Required
DATABASE_URL=postgresql://...          # PostgreSQL connection string
JWT_SECRET=xxx                         # Random secret key (generate with: openssl rand -base64 32)
ADMIN_PASSWORD=xxx                     # Admin login password
FRONTEND_URL=https://your-domain.com   # Frontend URL for CORS

# Optional
PORT=3001                              # Server port (default: 3001)
NODE_ENV=production                    # Environment
UPLOAD_DIR=./uploads                   # Upload directory
MAX_FILE_SIZE=5242880                 # Max file size (5MB)
```

### Frontend
```env
# Required
REACT_APP_API_URL=https://api.your-domain.com/api   # Backend API URL
```

---

## Post-Deployment Checklist

- [ ] Test admin login
- [ ] Create test couple
- [ ] Add test sufgania
- [ ] Upload test photo
- [ ] Test couple login
- [ ] Test voting flow
- [ ] Test results publishing
- [ ] Verify CORS settings
- [ ] Test on mobile device
- [ ] Setup monitoring (optional)
- [ ] Configure backups (optional)

---

## Monitoring & Maintenance

### Logging

**Railway/Heroku/Render:**
- Built-in log viewers in dashboard

**VPS:**
```bash
# View backend logs
pm2 logs sufgavote-api

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backups

**Heroku:**
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

**Railway:**
- Use Railway dashboard

**VPS:**
```bash
# Create backup
pg_dump sufgavote > backup_$(date +%Y%m%d).sql

# Restore backup
psql sufgavote < backup_20231215.sql
```

---

## Troubleshooting

### CORS Errors

Check that `FRONTEND_URL` in backend `.env` matches your actual frontend URL.

### Database Connection Issues

Verify `DATABASE_URL` format:
```
postgresql://username:password@host:port/database
```

### File Upload Issues

Ensure upload directory has write permissions:
```bash
chmod 755 backend/uploads
```

### Build Failures

Clear cache and rebuild:
```bash
npm ci
npm run build
```

---

## Cost Estimates

### Free Tiers (Hobby Projects)
- **Railway**: Free 500 hours/month
- **Render**: Free tier available
- **Heroku**: Free tier (deprecated, paid plans start $7/month)

### Paid Plans (Production)
- **Railway**: ~$5-10/month
- **Render**: ~$7-15/month
- **DigitalOcean**: ~$12/month (Droplet + Database)
- **VPS**: $5-20/month depending on provider

---

## Security Best Practices

1. **Use Strong Passwords**
   - Generate random passwords for admin and database
   - Never commit `.env` files to git

2. **Enable HTTPS**
   - Most platforms provide free SSL
   - For VPS, use Let's Encrypt (certbot)

3. **Regular Updates**
   - Keep dependencies updated: `npm audit fix`
   - Update OS packages on VPS

4. **Database Security**
   - Use internal database URLs when available
   - Restrict database access to app only

5. **Environment Variables**
   - Never hardcode secrets
   - Use platform-specific secrets management

---

## Need Help?

- Check platform-specific documentation
- Review application logs
- Test locally first before deploying
- Ensure all environment variables are set correctly

Good luck with your deployment! 🚀🍩
