# Getting Started with SufgaVote

This guide will help you set up and run the SufgaVote application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager (comes with Node.js)

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository (if not already cloned)
git clone <your-repo-url>
cd SufgaVote

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Database

```bash
# Create PostgreSQL database
createdb sufgavote

# Or using psql:
psql postgres
CREATE DATABASE sufgavote;
\q
```

### 3. Configure Environment Variables

**Backend (.env):**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update with your settings:

```env
# Server
PORT=3001
NODE_ENV=development

# Database (choose one method)
# Method 1: Full connection URL
DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/sufgavote

# Method 2: Individual parameters
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sufgavote
DB_USER=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD

# Authentication
JWT_SECRET=your_super_secret_key_change_this
ADMIN_PASSWORD=admin123

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**

```bash
cd ../frontend
cp .env.example .env
```

The default settings should work for local development:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Run the Application

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

You should see:
```
✓ Database connection established successfully
✓ Database synchronized successfully
🍩 SufgaVote API Server running on http://localhost:3001
```

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm start
```

The app will open in your browser at `http://localhost:3000`

## First Time Setup

### 1. Login as Admin

- Open `http://localhost:3000`
- Click "Admin Login"
- Enter the password you set in `.env` (default: `admin123`)

### 2. Add Couples

- In the Admin Dashboard, go to the "Couples" tab
- Add couple names (e.g., "Sarah & Mike", "John & Emma")
- Each couple will automatically get a unique login code
- Write down the login codes - couples will need these to vote

### 3. Add Sufganiot

- Go to the "Sufganiot" tab
- For each couple, add their sufgania:
  - Select the couple from dropdown
  - Enter a creative sufgania name (e.g., "The Golden Dream", "Choco-Explosion")
  - Click "Add Sufgania"
- Upload photos for each sufgania

### 4. Open Voting

- In the Control Panel, click "Open Voting"
- Status will change to 🟢 Open
- Couples can now start voting!

### 5. Voting as a Couple

- Logout from admin
- Click "Couple Login"
- Enter a couple's login code
- You'll see the voting interface with all sufganiot (except your own)

**How to Vote:**

1. **Vote Tab:**
   - Select a category (Taste, Creativity, or Presentation)
   - Drag and drop sufganiot to rank them
   - Top = Best, Bottom = Least favorite
   - Click "Save Rankings"
   - Repeat for all 3 categories

2. **Comments Tab:**
   - Add optional text comments for each sufgania
   - Maximum 500 characters per comment

3. **Results Tab:**
   - Will show results once admin publishes them

### 6. Viewing Results (Admin)

- Login as admin
- Go to "Results" tab
- See real-time rankings and scores
- View voting progress (how many couples have voted)
- When ready, click "Publish Results"

### 7. Viewing Results (Couples)

- Couples can view results in their "Results" tab
- Only visible after admin publishes results
- Shows final rankings with scores breakdown

## Project Structure

```
SufgaVote/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, upload
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── server.js       # Main server file
│   ├── uploads/            # Uploaded photos
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── admin/      # Admin dashboard
│   │   │   ├── voting/     # Voting interface
│   │   │   └── common/     # Shared components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API calls
│   │   └── styles/         # CSS files
│   └── package.json
│
├── DESIGN.md              # Detailed design document
├── GETTING_STARTED.md     # This file
└── README.md              # Project overview
```

## API Endpoints Reference

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/couple/login` - Couple login

### Admin (requires admin auth)
- `GET /api/admin/couples` - List couples
- `POST /api/admin/couples` - Create couple
- `GET /api/admin/sufganiot` - List sufganiot
- `POST /api/admin/sufganiot` - Create sufgania
- `POST /api/admin/sufganiot/:id/photo` - Upload photo
- `GET /api/admin/results` - View results
- `POST /api/admin/voting/open` - Open voting
- `POST /api/admin/voting/close` - Close voting
- `POST /api/admin/results/publish` - Publish results

### Voting (requires couple auth)
- `GET /api/voting/sufganiot` - Get votable sufganiot
- `POST /api/voting/rankings` - Submit rankings
- `POST /api/voting/comments` - Add comment

### Results
- `GET /api/results` - Get published results
- `GET /api/results/gallery` - Photo gallery

## Troubleshooting

### Database Connection Errors

```
✗ Unable to connect to database
```

**Solutions:**
1. Make sure PostgreSQL is running: `pg_isready`
2. Verify database exists: `psql -l | grep sufgavote`
3. Check credentials in `.env` file
4. Try connecting manually: `psql -U YOUR_USERNAME -d sufgavote`

### Port Already in Use

```
Error: Port 3001 already in use
```

**Solutions:**
1. Kill the process: `lsof -ti:3001 | xargs kill -9`
2. Or change port in `backend/.env`

### Can't Upload Photos

**Solutions:**
1. Make sure `uploads` directory exists: `mkdir -p backend/uploads`
2. Check file permissions
3. Verify MAX_FILE_SIZE in `.env`

### Couples Can't See Sufganiot

**Possible causes:**
1. No sufganiot added yet
2. Couple is trying to see their own sufgania (blocked by design)
3. Database not synchronized

### Drag-and-Drop Not Working

**Solutions:**
1. Make sure voting is open (check admin control panel)
2. Try refreshing the page
3. Check browser console for errors

## Testing the System

### Quick Test Scenario

1. **Setup (Admin):**
   - Create 3 couples: "Alice & Bob", "Carol & Dave", "Eve & Frank"
   - Create 3 sufganiot with names and photos
   - Open voting

2. **Vote (As Alice & Bob):**
   - Login with their code
   - Rank all 3 categories
   - Add comments
   - Note: They won't see their own sufgania

3. **Vote (As Carol & Dave):**
   - Login and vote similarly

4. **Check Results (Admin):**
   - View real-time results
   - See voting progress (2/3 couples voted)

5. **Publish Results:**
   - Click "Publish Results"
   - Have couples check their Results tab

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions to:
- Railway
- Heroku
- Render
- Custom VPS

## Support

For issues or questions:
1. Check the [DESIGN.md](DESIGN.md) for detailed architecture
2. Review backend logs for API errors
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## Next Steps

- [ ] Customize the design (colors, fonts)
- [ ] Add more features (see DESIGN.md - Future Enhancements)
- [ ] Deploy to production
- [ ] Test with real users
- [ ] Enjoy your sufganiot competition! 🍩

---

**Made with ❤️ for sufganiot lovers everywhere**
