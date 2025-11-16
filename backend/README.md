# SufgaVote Backend API

Backend API server for the SufgaVote voting system.

## Setup

### Prerequisites
- Node.js v18+
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/sufgavote
JWT_SECRET=your_secret_key_here
ADMIN_PASSWORD=your_admin_password
```

4. Create the database:
```bash
createdb sufgavote
```

### Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001` (or the PORT specified in .env).

## API Documentation

### Authentication

#### Admin Login
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "password": "admin123"
}
```

#### Couple Login
```http
POST /api/auth/couple/login
Content-Type: application/json

{
  "loginCode": "ABC123"
}
```

### Admin Endpoints

All admin endpoints require authentication with admin role.

**Header:**
```
Authorization: Bearer <admin_token>
```

#### Couples
- `GET /api/admin/couples` - Get all couples
- `POST /api/admin/couples` - Create couple
- `PUT /api/admin/couples/:id` - Update couple
- `DELETE /api/admin/couples/:id` - Delete couple
- `POST /api/admin/couples/:id/regenerate-code` - Generate new login code

#### Sufganiot
- `GET /api/admin/sufganiot` - Get all sufganiot
- `POST /api/admin/sufganiot` - Create sufgania
- `PUT /api/admin/sufganiot/:id` - Update sufgania
- `DELETE /api/admin/sufganiot/:id` - Delete sufgania
- `POST /api/admin/sufganiot/:id/photo` - Upload photo (multipart/form-data)

#### Results & Settings
- `GET /api/admin/results` - Get real-time results
- `GET /api/admin/comments` - Get all comments
- `GET /api/admin/settings` - Get settings
- `POST /api/admin/voting/open` - Open voting
- `POST /api/admin/voting/close` - Close voting
- `POST /api/admin/results/publish` - Publish results
- `POST /api/admin/results/unpublish` - Unpublish results

### Voting Endpoints

All voting endpoints require authentication with couple role (except status).

**Header:**
```
Authorization: Bearer <couple_token>
```

- `GET /api/voting/status` - Get voting status (public)
- `GET /api/voting/sufganiot` - Get votable sufganiot
- `GET /api/voting/my-votes` - Get couple's votes
- `POST /api/voting/rankings` - Submit rankings
- `POST /api/voting/comments` - Add/update comment

### Results Endpoints

- `GET /api/results` - Get published results (requires auth)
- `GET /api/results/gallery` - Get photo gallery (public)

## Database Schema

The application uses PostgreSQL with Sequelize ORM. Tables are automatically created on first run.

**Tables:**
- `couples` - Participant couples
- `sufganiot` - Sufgania entries
- `votes` - Ranking votes
- `comments` - Text comments
- `settings` - Application settings

## File Uploads

Photos are stored in the `./uploads` directory and served statically at `/uploads/:filename`.

**Accepted formats:** JPEG, PNG, GIF, WebP
**Max file size:** 5MB (configurable in .env)

## Development

### Database Reset

To reset the database during development, temporarily change `syncDatabase(false)` to `syncDatabase(true)` in `src/server.js`. This will drop and recreate all tables.

**⚠️ WARNING:** This will delete all data!

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── uploads/             # Uploaded photos
└── package.json
```

## License

MIT
