#!/bin/bash

# ===========================================
# PONTIGRAM NEWS - DEPLOYMENT SCRIPT
# ===========================================

echo "🚀 Starting Pontigram News Deployment..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Step 3: Build the application
echo "🔨 Building application..."
npm run build

# Step 4: Test build locally (optional)
echo "🧪 Testing build locally..."
echo "Run 'npm start' to test the production build locally"

# Step 5: Deploy to Vercel
echo "☁️ Deploying to Vercel..."
echo "1. Push to GitHub: git add . && git commit -m 'Deploy to production' && git push"
echo "2. Go to vercel.com and import your repository"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy!"

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Supabase DATABASE_URL"
echo "2. Run: npx prisma db push (to create tables in Supabase)"
echo "3. Run: npm run db:seed (to add initial data)"
echo "4. Push to GitHub and deploy via Vercel"
echo ""
echo "🌐 Your app will be available at: https://your-app-name.vercel.app"
