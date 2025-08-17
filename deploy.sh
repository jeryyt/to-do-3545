#!/bin/bash

# Todo App Deployment Script for Render
echo "🚀 Preparing Todo App for Render deployment..."

# Install all dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the React app
echo "🔨 Building React app for production..."
cd client && npm run build && cd ..

# Test the build
echo "🧪 Testing production build..."
echo "Backend health check..."
cd server && timeout 10s npm start &
SERVER_PID=$!
sleep 5

# Check if server is running
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is working!"
else
    echo "❌ Backend test failed"
fi

# Kill test server
kill $SERVER_PID 2>/dev/null

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps for Render deployment:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Render will use the render.yaml file to deploy both services"
echo "4. Update CORS origins in server/index.js with your actual Render URLs"
echo ""
echo "🔗 Your app will be available at:"
echo "   Frontend: https://todo-client.onrender.com"
echo "   Backend:  https://todo-api.onrender.com"