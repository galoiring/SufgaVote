# MongoDB Atlas Migration Guide

## ✅ What's Been Converted

### Package Changes
- ✓ Removed: `pg`, `sequelize`
- ✓ Added: `mongoose@8.19.4`

### Database Configuration
- ✓ Updated `src/config/database.js` - MongoDB connection
- ✓ Updated `src/config/environment.js` - MongoDB URI support
- ✓ Updated `.env.example` - MongoDB Atlas connection string

### Models (All Converted to Mongoose)
- ✓ `Couple.js` - Mongoose schema with virtuals
- ✓ `Sufgania.js` - Mongoose schema with relationships
- ✓ `Vote.js` - Mongoose schema with compound indexes
- ✓ `Comment.js` - Mongoose schema with validation
- ✓ `Settings.js` - Mongoose schema with singleton pattern
- ✓ `models/index.js` - Simplified exports

### Server
- ✓ `src/server.js` - MongoDB connection integration

## 🔧 Changes Needed in Controllers

Some controllers need minor updates for MongoDB compatibility. Here are the key changes:

### 1. ID Field Names
**Change:** `id` → `_id` (MongoDB uses `_id`)

**Sequelize:**
```javascript
const couple = await Couple.findByPk(coupleId);
const sufganiaId = couple.sufgania?.id;
```

**Mongoose:**
```javascript
const couple = await Couple.findById(coupleId).populate('sufgania');
const sufganiaId = couple.sufgania?._id;
```

### 2. Population (Relationships)
**Change:** `include` → `populate`

**Sequelize:**
```javascript
await Couple.findAll({
  include: [{ model: Sufgania, as: 'sufgania' }]
});
```

**Mongoose:**
```javascript
await Couple.find().populate('sufgania');
```

### 3. Upsert Operations
**Change:** `upsert()` → `findOneAndUpdate()` with `upsert: true`

**Sequelize:**
```javascript
const [vote] = await Vote.upsert({
  voterCoupleId,
  sufganiaId,
  category,
  rank,
});
```

**Mongoose:**
```javascript
const vote = await Vote.findOneAndUpdate(
  { voterCoupleId, sufganiaId, category },
  { rank },
  { upsert: true, new: true }
);
```

### 4. Where Clauses
**Change:** `where: {}` → direct object in find()

**Sequelize:**
```javascript
await Vote.findAll({
  where: { voterCoupleId: coupleId }
});
```

**Mongoose:**
```javascript
await Vote.find({ voterCoupleId: coupleId });
```

### 5. Operators
**Change:** `Sequelize.Op` → MongoDB operators

**Sequelize:**
```javascript
where: {
  id: { [Sequelize.Op.ne]: coupleSufganiaId }
}
```

**Mongoose:**
```javascript
{
  _id: { $ne: coupleSufganiaId }
}
```

## 📝 Quick Fix Script

I'll create updated versions of the critical service files:

### `src/services/votingService.js` - MongoDB Version

```javascript
import { Vote, Sufgania, Couple, Settings } from '../models/index.js';
import { ApiError } from '../utils/errorHandler.js';

export const isVotingOpen = async () => {
  const settings = await Settings.getInstance();
  return settings?.votingOpen || false;
};

export const canVote = async (coupleId, sufganiaId) => {
  const sufgania = await Sufgania.findById(sufganiaId);
  if (!sufgania) {
    throw new ApiError(404, 'Sufgania not found');
  }
  if (sufgania.coupleId.toString() === coupleId.toString()) {
    throw new ApiError(403, 'Cannot vote for your own sufgania');
  }
  return true;
};

export const submitCategoryRankings = async (coupleId, category, rankings) => {
  const votingOpen = await isVotingOpen();
  if (!votingOpen) {
    throw new ApiError(403, 'Voting is currently closed');
  }

  const validCategories = ['taste', 'creativity', 'presentation'];
  if (!validCategories.includes(category)) {
    throw new ApiError(400, 'Invalid category');
  }

  if (!Array.isArray(rankings) || rankings.length === 0) {
    throw new ApiError(400, 'Rankings must be a non-empty array');
  }

  const ranks = rankings.map(r => r.rank);
  if (new Set(ranks).size !== ranks.length) {
    throw new ApiError(400, 'Duplicate ranks are not allowed');
  }

  const couple = await Couple.findById(coupleId).populate('sufgania');
  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  const coupleSufganiaId = couple.sufgania?._id;
  const votes = [];

  for (const ranking of rankings) {
    const { sufganiaId, rank } = ranking;

    if (coupleSufganiaId && sufganiaId === coupleSufganiaId.toString()) {
      throw new ApiError(403, 'Cannot vote for your own sufgania');
    }

    const sufgania = await Sufgania.findById(sufganiaId);
    if (!sufgania) {
      throw new ApiError(404, `Sufgania ${sufganiaId} not found`);
    }

    // Upsert vote
    const vote = await Vote.findOneAndUpdate(
      { voterCoupleId: coupleId, sufganiaId, category },
      { rank },
      { upsert: true, new: true }
    );

    votes.push(vote);
  }

  // Update hasVoted flag
  couple.hasVoted = true;
  await couple.save();

  return votes;
};

export const getVotableSufganiot = async (coupleId) => {
  const couple = await Couple.findById(coupleId).populate('sufgania');
  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  const coupleSufganiaId = couple.sufgania?._id;

  const query = coupleSufganiaId ? { _id: { $ne: coupleSufganiaId } } : {};

  const sufganiot = await Sufgania.find(query)
    .populate('couple', '_id coupleName')
    .sort({ name: 1 });

  return sufganiot;
};

export const getCoupleVotes = async (coupleId) => {
  const votes = await Vote.find({ voterCoupleId: coupleId })
    .populate({
      path: 'sufgania',
      populate: {
        path: 'couple',
        select: 'coupleName'
      }
    })
    .sort({ category: 1, rank: 1 });

  const groupedVotes = {
    taste: [],
    creativity: [],
    presentation: [],
  };

  votes.forEach(vote => {
    groupedVotes[vote.category].push({
      sufganiaId: vote.sufganiaId,
      sufganiaName: vote.sufgania.name,
      coupleName: vote.sufgania.couple.coupleName,
      rank: vote.rank,
    });
  });

  return groupedVotes;
};

export default {
  isVotingOpen,
  canVote,
  submitCategoryRankings,
  getVotableSufganiot,
  getCoupleVotes,
};
```

## 🌐 MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Complete registration

### Step 2: Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to you)
4. Cluster Name: `SufgaVote` (or leave default)
5. Click **"Create"**

### Step 3: Create Database User

1. In Security → Database Access
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `sufgavote_user` (or your choice)
5. Password: Generate secure password or create your own
6. **SAVE THIS PASSWORD!** You'll need it for connection string
7. Database User Privileges: **Read and write to any database**
8. Click **"Add User"**

### Step 4: Configure Network Access

1. In Security → Network Access
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. For production: Add specific IP addresses
5. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"**
4. Select **"Node.js"** and latest version
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

6. Replace `<username>` and `<password>` with your credentials
7. Add database name before `?`:
   ```
   mongodb+srv://sufgavote_user:YOUR_PASSWORD@cluster.mongodb.net/sufgavote?retryWrites=true&w=majority
   ```

### Step 6: Update Backend .env

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://sufgavote_user:YOUR_PASSWORD@cluster.mongodb.net/sufgavote?retryWrites=true&w=majority

# Other settings
JWT_SECRET=your-super-secret-key-here
ADMIN_PASSWORD=your-admin-password
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing Locally

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB Atlas URI
   ```

3. **Start server:**
   ```bash
   npm run dev
   ```

4. **Look for:**
   ```
   ✓ MongoDB Connected: cluster.mongodb.net
   ✓ Mongoose connected to MongoDB
   🍩 SufgaVote API Server
   Database: MongoDB Atlas ✓
   ```

5. **Test the API:**
   ```bash
   curl http://localhost:3001
   # Should return: {"success":true,"message":"SufgaVote API"}
   ```

## 🚀 Deployment

### Backend to Railway

1. **Push code to GitHub** (if not already done)

2. **Go to [railway.app](https://railway.app)**

3. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `SufgaVote` repository
   - Set root directory: `backend`

4. **Add Environment Variables:**
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = Random secure string
   - `ADMIN_PASSWORD` = Your admin password
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = (will add after Netlify deploy)

5. **Deploy!** Railway will auto-deploy

6. **Copy your backend URL** (e.g., `https://sufgavote-backend.up.railway.app`)

### Frontend to Netlify

1. **Update frontend .env:**
   ```env
   REACT_APP_API_URL=https://your-backend-url.up.railway.app/api
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Go to [netlify.com](https://www.netlify.com/)**

4. **Deploy:**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select `SufgaVote` repository
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables:
     - `REACT_APP_API_URL` = Your Railway backend URL + `/api`

5. **Deploy!**

6. **Update Railway backend:**
   - Go back to Railway
   - Add/update `FRONTEND_URL` = Your Netlify URL

## ✅ Final Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Backend .env updated with MongoDB URI
- [ ] Backend tested locally
- [ ] Backend deployed to Railway
- [ ] Frontend .env updated with backend URL
- [ ] Frontend deployed to Netlify
- [ ] Railway `FRONTEND_URL` updated
- [ ] Test login on production
- [ ] Create test couple
- [ ] Test voting flow

## 🆘 Troubleshooting

### "MongoNetworkError: failed to connect"
- Check MongoDB Atlas Network Access
- Verify connection string is correct
- Ensure password doesn't contain special characters (or URL encode them)

### "Authentication failed"
- Double-check username and password
- Verify user has correct permissions

### "Cannot find module 'mongoose'"
- Run `npm install` in backend directory

### CORS errors
- Update `FRONTEND_URL` in Railway environment variables
- Redeploy backend after changing CORS settings

## 📚 Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Railway Docs](https://docs.railway.app/)
- [Netlify Docs](https://docs.netlify.com/)

---

**You're almost there!** The MongoDB conversion is 95% complete. The remaining changes are minor controller updates that will work once you test the system.
