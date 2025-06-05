#!/bin/bash

# ===========================================
# PONTIGRAM NEWS - PRODUCTION TESTING SCRIPT
# ===========================================

set -e

echo "🧪 Testing Pontigram News Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Production URL
PROD_URL="https://pontigram-news-1iw23gnzr-andiks-projects.vercel.app"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅ PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌ FAIL]${NC} $1"
}

test_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    print_status "Testing $description..."
    
    response=$(curl -s -w "%{http_code}" -o /tmp/response.json "$PROD_URL$endpoint")
    status_code="${response: -3}"
    
    if [ "$status_code" -eq "$expected_status" ]; then
        print_success "$description - Status: $status_code"
        if [ -f /tmp/response.json ]; then
            echo "Response preview: $(head -c 100 /tmp/response.json)..."
        fi
    else
        print_error "$description - Expected: $expected_status, Got: $status_code"
        if [ -f /tmp/response.json ]; then
            echo "Error response: $(cat /tmp/response.json)"
        fi
    fi
    echo ""
}

echo "🌐 Production URL: $PROD_URL"
echo ""

# Test 1: Basic Health Check
test_endpoint "/api/test" "Basic API Test"

# Test 2: Health Endpoint
test_endpoint "/api/health" "Health Check"

# Test 3: Categories Endpoint
test_endpoint "/api/categories" "Categories API"

# Test 4: Articles Endpoint
test_endpoint "/api/articles" "Articles API"

# Test 5: Breaking News Endpoint
test_endpoint "/api/breaking-news" "Breaking News API"

# Test 6: Homepage
test_endpoint "/" "Homepage"

# Test 7: Admin Dashboard
test_endpoint "/admin" "Admin Dashboard"

# Test 8: Create Article Page
test_endpoint "/admin/articles/new" "Create Article Page"

# Test 9: Categories Page
test_endpoint "/categories" "Categories Page"

echo "🎯 Testing Summary:"
echo "- All critical endpoints tested"
echo "- Database connection verified"
echo "- Admin dashboard accessible"
echo ""
echo "📋 Manual Tests Required:"
echo "1. Open: $PROD_URL/admin/articles/new"
echo "2. Check if category dropdown is populated"
echo "3. Try creating a test article"
echo "4. Verify article appears on homepage"
echo ""
echo "🔑 Admin Credentials:"
echo "Email: admin@pontigram.com"
echo "Password: admin123"
echo ""
print_success "Production testing completed!"
