# Deployment Guide - Render

This guide will help you deploy your Todo App to Render.

## 🚀 Quick Deploy to Render

### Method 1: Using render.yaml (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Sign up/Sign in with your GitHub account
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Deploy**
   - Render will create two services:
     - `todo-api` (Backend)
     - `todo-client` (Frontend)
   - Wait for both services to deploy (5-10 minutes)

### Method 2: Manual Setup

#### Backend Service
1. Create a new Web Service
2. Connect your GitHub repo
3. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `FRONTEND_URL=https://your-frontend-url.onrender.com`

#### Frontend Service
1. Create another Web Service
2. Connect the same GitHub repo
3. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Start Command**: `cd client && npx serve -s build -p $PORT`
   - **Environment Variables**:
     - `REACT_APP_API_URL=https://your-backend-url.onrender.com`

## 🔧 Configuration

### Environment Variables

**Backend (`todo-api`)**:
- `NODE_ENV=production`
- `PORT` (automatically set by Render)
- `FRONTEND_URL` (your frontend Render URL)

**Frontend (`todo-client`)**:
- `REACT_APP_API_URL` (your backend Render URL)

### CORS Configuration

Update the CORS origins in `server/index.js` with your actual Render URLs:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-actual-frontend-url.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);
```

## 📝 Post-Deployment

1. **Test your app**: Visit your frontend URL
2. **Check health**: Visit `https://your-backend-url.onrender.com/api/health`
3. **Monitor logs**: Use Render dashboard to check service logs

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update allowed origins in server code
2. **Build Failures**: Check build logs in Render dashboard
3. **Database Issues**: SQLite file is created automatically
4. **Environment Variables**: Ensure all required vars are set

### Useful Commands:
```bash
# Test locally before deploying
./deploy.sh

# Check production build
cd client && npm run build
cd server && npm start
```

## 📊 Free Tier Limits

Render Free Tier includes:
- 750 hours/month per service
- Services spin down after 15 minutes of inactivity
- Cold start time ~30 seconds

## 🎉 Success!

Your Todo App should now be live at:
- **Frontend**: `https://todo-client.onrender.com`
- **Backend API**: `https://todo-api.onrender.com`

Enjoy your deployed Todo App! 🚀