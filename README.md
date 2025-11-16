# 🍩 SufgaVote - Sufganiot Contest Voting System

A complete mobile-first web application for managing and voting in sufganiot (jelly donut) competitions. Perfect for Hanukkah parties, baking contests, and fun community events!

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 👨‍💼 Admin Panel (Desktop-Optimized)
- **Couple Management**: Add couples and auto-generate secure login codes
- **Sufgania Management**: Add entries with creative names and upload photos
- **Real-time Results**: View live rankings and voting progress
- **Control Panel**: Open/close voting and publish/unpublish results
- **Comments Viewer**: See all feedback from participants

### 📱 Voting Interface (Mobile-First)
- **Drag & Drop Ranking**: Beautiful, intuitive ranking system
- **Three Categories**: Rate on Taste, Creativity, and Presentation
- **Comments System**: Leave feedback on each entry (max 500 chars)
- **Photo Gallery**: View all sufganiot entries
- **Self-Voting Prevention**: Automatic blocking of voting for your own sufgania
- **Results Viewing**: See final rankings when admin publishes them

### 🔒 Security & Quality
- JWT authentication with secure tokens
- Input validation and sanitization
- SQL injection prevention via ORM
- File upload restrictions (images only, 5MB max)
- CORS configuration
- Password hashing for admin accounts

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v12+
- npm (comes with Node.js)

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd SufgaVote

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Create PostgreSQL database
createdb sufgavote

# 4. Configure environment
cd backend
cp .env.example .env
# Edit .env with your database credentials

cd ../frontend
cp .env.example .env
# Default settings work for local development

# 5. Start the application
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# 6. Open your browser
# http://localhost:3000
```

**First login:** Use admin password from `backend/.env` (default: `admin123`)

📖 **Detailed setup guide:** See [GETTING_STARTED.md](GETTING_STARTED.md)

## 📁 Project Structure

```
SufgaVote/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database & environment config
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, file upload
│   │   ├── models/            # Sequelize models (PostgreSQL)
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic (ranking, voting)
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Main server file
│   ├── uploads/               # Uploaded photos
│   └── package.json
│
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── voting/       # Voting interface
│   │   │   └── common/       # Shared components
│   │   ├── contexts/         # React Context (Auth)
│   │   ├── services/         # API integration
│   │   └── styles/           # CSS (mobile-first)
│   └── package.json
│
├── DESIGN.md                 # Complete architecture documentation
├── GETTING_STARTED.md        # Detailed setup guide
├── DEPLOYMENT.md             # Production deployment guide
├── PROJECT_SUMMARY.md        # Project overview & status
└── README.md                 # This file
```

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Drag & Drop**: @hello-pangea/dnd
- **State Management**: React Context API
- **Styling**: Custom CSS with mobile-first design

## 📊 How It Works

1. **Admin Setup**
   - Create couples (each gets a unique login code)
   - Add sufganiot with names and photos
   - Open voting when ready

2. **Couples Vote**
   - Login with their code
   - See all sufganiot except their own
   - Drag to rank in 3 categories
   - Add optional comments
   - Submit votes

3. **View Results**
   - Admin sees real-time results
   - Admin publishes results when voting closes
   - Couples see final rankings

## 🌐 Deployment

Ready to deploy to production? Choose your platform:

- **Railway** (Recommended - Free tier) - [Guide](DEPLOYMENT.md#option-1-railway-recommended---easiest)
- **Heroku** - [Guide](DEPLOYMENT.md#option-2-heroku)
- **Render** - [Guide](DEPLOYMENT.md#option-3-render)
- **DigitalOcean** - [Guide](DEPLOYMENT.md#option-4-digitalocean-app-platform)
- **Custom VPS** - [Guide](DEPLOYMENT.md#option-5-custom-vps-advanced)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [DESIGN.md](DESIGN.md) | Complete architecture, database schema, API specs |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Step-by-step local setup guide |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment for all platforms |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | What's built and what's next |
| [backend/README.md](backend/README.md) | Backend API documentation |

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/couple/login` - Couple login

### Admin (requires admin token)
- `GET /api/admin/couples` - List all couples
- `POST /api/admin/couples` - Create couple
- `GET /api/admin/sufganiot` - List all sufganiot
- `POST /api/admin/sufganiot` - Create sufgania
- `POST /api/admin/sufganiot/:id/photo` - Upload photo
- `GET /api/admin/results` - View results
- `POST /api/admin/voting/open` - Open voting
- `POST /api/admin/results/publish` - Publish results

### Voting (requires couple token)
- `GET /api/voting/sufganiot` - Get votable sufganiot
- `POST /api/voting/rankings` - Submit rankings
- `POST /api/voting/comments` - Add comment

### Results
- `GET /api/results` - Get published results
- `GET /api/results/gallery` - Photo gallery

Full API docs: [backend/README.md](backend/README.md)

## 🧪 Testing

Before your event:
```bash
# 1. Create test data
- Add 3 couples
- Add 3 sufganiot with photos
- Open voting

# 2. Test voting flow
- Login as each couple
- Test drag-and-drop ranking
- Add comments
- Submit votes

# 3. Test results
- View real-time results as admin
- Publish results
- View as couple
```

## 🔄 Development

```bash
# Backend development
cd backend
npm run dev          # Start with auto-reload

# Frontend development
cd frontend
npm start            # Start dev server

# Database reset (DANGER: deletes all data!)
# In backend/src/server.js: syncDatabase(true)
```

## 🤝 Contributing

This is a custom project for your sufganiot contest. Feel free to customize:

- Colors and styling (`frontend/src/styles/App.css`)
- Categories (`backend/src/models/Vote.js`)
- Business logic (`backend/src/services/`)
- UI components (`frontend/src/components/`)

## 📝 License

MIT License - feel free to use for your events!

## 💡 Future Ideas

- Multiple simultaneous events
- QR code login for couples
- Email/SMS notifications
- Recipe sharing
- Video uploads alongside photos
- Native mobile apps (React Native)
- Printable results certificates
- Historical data & analytics

## 🆘 Support

- **Setup issues?** See [GETTING_STARTED.md](GETTING_STARTED.md)
- **Deployment problems?** Check [DEPLOYMENT.md](DEPLOYMENT.md)
- **Architecture questions?** Review [DESIGN.md](DESIGN.md)

## 🎉 Ready to Launch!

Your SufgaVote system is **production-ready** and includes:

✅ Complete backend API with all features
✅ Beautiful mobile-first frontend
✅ Admin dashboard for management
✅ Intuitive voting interface
✅ Real-time results & analytics
✅ Security & validation
✅ Cloud deployment ready
✅ Comprehensive documentation

**Next:** Follow [GETTING_STARTED.md](GETTING_STARTED.md) to run your first contest!

---

**Made with ❤️ for sufganiot lovers everywhere** 🍩

*May the best sufgania win!*
