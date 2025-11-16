# SufgaVote - Application Design & Planning Document

## Overview
SufgaVote is a mobile-first web application for managing and voting in sufganiot (jelly donut) competitions. The system supports 10-20 couples who each create a sufgania and vote on others' creations.

## Core Concepts

### Participants
- **Couples**: Each couple creates one sufgania together
- **Expected Scale**: 10-20 couples per event
- **Voting**: Each couple votes together using a shared login code
- **Restriction**: Couples cannot vote for their own sufgania

### Sufganiot (Entries)
- **Name**: Each sufgania has a unique creative name
- **Photo**: Admin uploads photos during the event
- **Creator**: Associated with a couple
- **Categories**: Rated on three criteria

### Voting System
- **Method**: Drag-and-drop ranking interface
- **Categories**:
  1. Taste
  2. Creativity
  3. Presentation
- **Process**: Couples rank all sufganiot (except their own) in each category
- **Comments**: Optional text feedback on each sufgania

## User Roles & Interfaces

### 1. Admin (Desktop Interface)

#### Capabilities
- **Couple Management**
  - Add/edit/delete couples
  - Generate unique login codes for each couple
  - View which couples have voted

- **Sufgania Management**
  - Add sufganiot with names
  - Upload photos during the event
  - Associate each sufgania with a couple
  - Edit/delete entries

- **Results Dashboard**
  - View real-time voting results
  - See rankings for each category
  - View overall rankings (calculated from all categories)
  - Read all comments
  - Export results

- **Control Panel**
  - Start/stop voting period
  - Publish results to participants
  - Unpublish results if needed

#### Interface Design
- Desktop-optimized layout
- Dashboard with navigation sidebar
- Real-time updates using WebSocket or polling
- Data tables with sorting/filtering
- Image upload with preview

### 2. Voting Interface (Mobile-First)

#### Login Flow
1. Couple enters their unique code
2. System validates code
3. Session created for the couple
4. Redirect to voting page

#### Voting Page
- **Display**:
  - Grid/list of all sufganiot (except couple's own)
  - Each showing: photo, name, couple name
  - Three separate ranking areas (one per category)

- **Interaction**:
  - Drag and drop sufganiot to rank them
  - Position 1 = best, last position = lowest rank
  - Visual feedback during dragging
  - Save rankings per category

- **Comments**:
  - Optional text area for each sufgania
  - Character limit (e.g., 200 characters)
  - Can be edited until voting closes

- **Submit**:
  - Clear indication of voting progress
  - Confirmation before final submission
  - Ability to edit votes until voting closes

#### Photo Gallery
- View all sufganiot in a gallery format
- Enlarged photo view on click
- Swipe navigation between photos
- Display name and couple information

#### Results Page
- Only visible when admin publishes results
- Show final rankings
- Display category breakdowns
- Highlight couple's own sufgania performance

## Technical Architecture

### Frontend (React)

#### Structure
```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CoupleManager.jsx
│   │   │   ├── SufganiaManager.jsx
│   │   │   ├── ResultsDashboard.jsx
│   │   │   └── ControlPanel.jsx
│   │   ├── voting/
│   │   │   ├── Login.jsx
│   │   │   ├── SufganiaCard.jsx
│   │   │   ├── RankingArea.jsx
│   │   │   ├── CommentBox.jsx
│   │   │   └── VotingPage.jsx
│   │   ├── gallery/
│   │   │   └── PhotoGallery.jsx
│   │   └── results/
│   │       └── ResultsPage.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── VotingContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── dragDropHelpers.js
│   │   └── rankingCalculations.js
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

#### Key Libraries
- **React**: UI framework
- **React Router**: Navigation
- **React Beautiful DnD**: Drag-and-drop functionality
- **Axios**: HTTP requests
- **Socket.io-client**: Real-time updates (optional)
- **React Query**: Server state management
- **Tailwind CSS**: Styling (mobile-first)

### Backend (Node.js + Express)

#### Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── environment.js
│   ├── models/
│   │   ├── Couple.js
│   │   ├── Sufgania.js
│   │   ├── Vote.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── voting.js
│   │   └── results.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── votingController.js
│   │   └── resultsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── upload.js
│   ├── services/
│   │   ├── rankingService.js
│   │   └── votingService.js
│   ├── utils/
│   │   ├── codeGenerator.js
│   │   └── errorHandler.js
│   └── server.js
├── uploads/
├── package.json
└── README.md
```

#### Key Dependencies
- **Express**: Web framework
- **Sequelize/Prisma**: ORM for PostgreSQL
- **Multer**: File upload handling
- **bcrypt**: Password hashing (for admin)
- **jsonwebtoken**: Authentication tokens
- **cors**: Cross-origin requests
- **express-validator**: Input validation
- **socket.io**: Real-time updates (optional)

### Database Schema (PostgreSQL)

#### Tables

**couples**
- id (PRIMARY KEY, UUID)
- couple_name (VARCHAR, UNIQUE)
- login_code (VARCHAR, UNIQUE)
- has_voted (BOOLEAN, default: false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**sufganiot**
- id (PRIMARY KEY, UUID)
- name (VARCHAR)
- couple_id (FOREIGN KEY -> couples.id)
- photo_url (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**votes**
- id (PRIMARY KEY, UUID)
- voter_couple_id (FOREIGN KEY -> couples.id)
- sufgania_id (FOREIGN KEY -> sufganiot.id)
- category (ENUM: 'taste', 'creativity', 'presentation')
- rank (INTEGER) - position in ranking (1 = best)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(voter_couple_id, sufgania_id, category)

**comments**
- id (PRIMARY KEY, UUID)
- voter_couple_id (FOREIGN KEY -> couples.id)
- sufgania_id (FOREIGN KEY -> sufganiot.id)
- comment_text (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(voter_couple_id, sufgania_id)

**settings**
- id (PRIMARY KEY, UUID)
- voting_open (BOOLEAN, default: false)
- results_published (BOOLEAN, default: false)
- updated_at (TIMESTAMP)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Couple login with code
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/verify` - Verify session

### Admin
- `GET /api/admin/couples` - List all couples
- `POST /api/admin/couples` - Add new couple
- `PUT /api/admin/couples/:id` - Update couple
- `DELETE /api/admin/couples/:id` - Delete couple
- `POST /api/admin/couples/generate-codes` - Generate login codes

- `GET /api/admin/sufganiot` - List all sufganiot
- `POST /api/admin/sufganiot` - Add new sufgania
- `PUT /api/admin/sufganiot/:id` - Update sufgania
- `DELETE /api/admin/sufganiot/:id` - Delete sufgania
- `POST /api/admin/sufganiot/:id/photo` - Upload photo

- `GET /api/admin/results` - Get all results with rankings
- `GET /api/admin/comments` - Get all comments
- `POST /api/admin/publish-results` - Publish results to participants
- `POST /api/admin/unpublish-results` - Hide results from participants

- `POST /api/admin/voting/open` - Open voting period
- `POST /api/admin/voting/close` - Close voting period

### Voting
- `GET /api/voting/sufganiot` - Get all sufganiot (excluding voter's own)
- `POST /api/voting/rank` - Submit rankings for a category
- `PUT /api/voting/rank/:id` - Update ranking
- `GET /api/voting/my-votes` - Get current couple's votes
- `POST /api/voting/comment` - Add/update comment
- `GET /api/voting/status` - Check if voting is open

### Results
- `GET /api/results` - Get published results (participants)
- `GET /api/results/gallery` - Get photo gallery

## Business Logic

### Ranking Calculation

For each sufgania, calculate scores:

1. **Category Score**:
   - For each vote in a category, convert rank to points
   - Points = (Total sufganiot) - (Rank) + 1
   - Example: If 10 sufganiot, rank 1 = 10 points, rank 2 = 9 points, etc.
   - Sum all points for that category

2. **Total Score**:
   - Sum of all category scores
   - Or weighted average if categories have different weights

3. **Final Rankings**:
   - Sort sufganiot by total score
   - Handle ties (e.g., by category priority or keep tied)

### Self-Voting Prevention

- When fetching sufganiot for voting, exclude the couple's own entry
- Validate on backend: reject votes where `voter_couple_id` = `sufgania.couple_id`
- Return error if attempt detected

### Voting State Management

- Couples can modify votes until voting closes
- `has_voted` flag updates when first vote submitted
- Admin sees real-time count of couples who voted

## UI/UX Design Principles

### Mobile-First
- Touch-friendly drag handles
- Minimum touch target: 44x44px
- Responsive grid/flex layouts
- Optimized images for mobile

### Accessibility
- ARIA labels for drag-and-drop
- Keyboard navigation support
- High contrast for text
- Alt text for images

### Visual Feedback
- Loading states during data fetch
- Success/error notifications
- Drag preview and drop zones
- Vote submission confirmation

### Color Scheme (Suggested)
- Primary: Warm orange/gold (sufganiya color)
- Secondary: Deep purple
- Success: Green
- Error: Red
- Background: Light cream/white
- Text: Dark brown/black

## Deployment Strategy

### Environment Variables
```
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=...
ADMIN_PASSWORD=...
PORT=3001
NODE_ENV=production
UPLOAD_DIR=./uploads

# Frontend
REACT_APP_API_URL=https://api.sufgavote.com
```

### Cloud Deployment Options

**Recommended: Railway**
- Easy PostgreSQL setup
- Simple deployment from GitHub
- Automatic HTTPS
- Free tier available

**Alternative: Heroku**
- Well-documented
- Add-ons for PostgreSQL
- Free tier limited

**Alternative: Render**
- Modern alternative to Heroku
- Free PostgreSQL and web services
- Auto-deploy from GitHub

### Deployment Steps
1. Set up PostgreSQL database
2. Deploy backend service
3. Run database migrations
4. Deploy frontend (static build)
5. Configure environment variables
6. Test with sample data
7. Create admin account

## Development Phases

### Phase 1: Core Infrastructure ✓
- [x] Project structure
- [ ] Backend setup with Express
- [ ] Database connection and models
- [ ] Basic API endpoints
- [ ] Frontend React setup

### Phase 2: Admin Features
- [ ] Couple management UI
- [ ] Sufgania management UI
- [ ] Photo upload functionality
- [ ] Admin authentication

### Phase 3: Voting System
- [ ] Couple login
- [ ] Sufganiot display
- [ ] Drag-and-drop ranking
- [ ] Comment functionality
- [ ] Self-voting prevention

### Phase 4: Results & Gallery
- [ ] Results calculation logic
- [ ] Admin results dashboard
- [ ] Results publishing control
- [ ] Photo gallery
- [ ] Results display for participants

### Phase 5: Polish & Deploy
- [ ] Mobile responsive testing
- [ ] Error handling
- [ ] Loading states
- [ ] Deployment configuration
- [ ] Production testing

## Testing Strategy

### Manual Testing Checklist
- [ ] Create 3-5 test couples
- [ ] Add 3-5 test sufganiot with photos
- [ ] Test login with each couple code
- [ ] Verify self-voting prevention
- [ ] Test drag-and-drop on mobile devices
- [ ] Submit votes from multiple couples
- [ ] Verify results calculations
- [ ] Test publish/unpublish results
- [ ] Test photo gallery on mobile
- [ ] Verify comments display

### Edge Cases
- What if a couple doesn't vote?
- What if voting closes mid-submission?
- What if two couples have same score?
- What if admin deletes a sufgania after votes?
- What if photo upload fails?

## Future Enhancements (Post-MVP)

- **Multiple Events**: Support multiple competitions
- **Historical Data**: Archive past contests
- **Email Notifications**: Notify couples when voting opens
- **QR Code Login**: Generate QR codes for couple login
- **Live Leaderboard Animation**: Animated rankings reveal
- **People's Choice Award**: Separate award based on votes
- **Recipe Sharing**: Couples can share their recipes
- **Video Support**: Allow video uploads alongside photos
- **Mobile App**: Native iOS/Android apps

## Security Considerations

### Authentication
- Secure random code generation for couples
- Admin password hashing with bcrypt
- JWT tokens with short expiration
- HTTP-only cookies for tokens

### Data Validation
- Input sanitization on all endpoints
- File upload restrictions (type, size)
- Rate limiting on API endpoints
- SQL injection prevention (ORM)

### Privacy
- No personal data collection beyond couple names
- Photos deleted after event (optional)
- Anonymous voting (couples don't see who voted)
- HTTPS only in production

## Success Metrics

- **Engagement**: % of couples who complete voting
- **Performance**: Page load time < 2 seconds on mobile
- **Reliability**: 99% uptime during event
- **Usability**: Voting completion time < 5 minutes per couple
- **Fun Factor**: Positive feedback from participants!

---

*Document Version: 1.0*
*Last Updated: 2025-11-15*
*Status: Planning Complete - Ready for Development*
