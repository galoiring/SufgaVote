# Deployment Guide

This guide covers deploying SufgaVote to production on various cloud platforms.

## Option 1: Railway (Recommended - Easiest)

Railway provides free PostgreSQL and easy deployment from GitHub.

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Steps

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
