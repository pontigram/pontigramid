#!/bin/bash

# ===========================================
# PONTIGRAM NEWS - PRODUCTION DEPLOYMENT SCRIPT
# ===========================================

set -e  # Exit on any error

echo "🚀 Starting Pontigram News Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Environment Check
print_status "Checking environment..."

if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    print_status "Creating .env.local from .env.example..."
    cp .env.example .env.local
    print_warning "Please update .env.local with your actual values before continuing!"
    exit 1
fi

# Step 2: Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache
print_success "Build cache cleaned"

# Step 3: Install dependencies
print_status "Installing dependencies..."
npm install --legacy-peer-deps
print_success "Dependencies installed"

# Step 4: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

# Step 5: Test database connection
print_status "Testing database connection..."
if node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => { console.log('✅ Database connection successful'); process.exit(0); })
  .catch((e) => { console.log('❌ Database connection failed:', e.message); process.exit(1); });
"; then
    print_success "Database connection verified"
else
    print_warning "Database connection failed - continuing with build (will use mock data)"
fi

# Step 6: Build the application
print_status "Building application for production..."
npm run build:production
print_success "Application built successfully"

# Step 7: Test build locally (optional)
print_status "Build completed successfully!"
echo ""
print_success "✅ Production build ready for deployment"
echo ""
echo "📋 Next steps for Vercel deployment:"
echo "1. Commit and push changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix deployment issues and prepare for production'"
echo "   git push origin main"
echo ""
echo "2. Set environment variables in Vercel dashboard:"
echo "   - DATABASE_URL (from your Supabase project)"
echo "   - DIRECT_URL (from your Supabase project)"
echo "   - NEXTAUTH_URL (your production domain)"
echo "   - NEXTAUTH_SECRET (generate a secure secret)"
echo "   - ADMIN_EMAIL"
echo "   - ADMIN_PASSWORD"
echo ""
echo "3. Deploy via Vercel CLI:"
echo "   npx vercel --prod"
echo ""
echo "4. After deployment, seed the database:"
echo "   npx vercel env pull .env.production"
echo "   npm run db:setup"
echo ""
print_warning "🔒 IMPORTANT: Disable Vercel Authentication in project settings!"
print_warning "Go to Vercel Dashboard → Project → Settings → Security → Disable Password Protection"
echo ""
print_success "🌐 Your app will be available at your Vercel domain"
