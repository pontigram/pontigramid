# Pontigram News Portal

A comprehensive full-stack news portal web application built with Next.js, featuring both a public-facing news site and a complete admin dashboard for content management.

## Features

### Public News Portal
- **Mobile-first responsive design** that works seamlessly on all devices
- **Modern, attractive UI** with enhanced typography and visual hierarchy
- **Hero section** featuring the latest/most important article with stunning visuals
- **Enhanced article cards** with improved spacing, hover effects, and placeholder images
- **Article listing** with thumbnails, summaries, and category filtering
- **Individual article pages** with full content and related articles
- **Social media sharing** with floating share buttons (Facebook, Twitter, LinkedIn, WhatsApp, Email)
- **Advanced search functionality** with real-time results and pagination
- **Dedicated categories page** with visual category cards and latest article previews
- **Category-based navigation** with dropdown menus and filtering
- **SEO-optimized** article pages with proper metadata
- **Responsive image galleries** with fallback placeholders

### Admin Dashboard
- **Complete content management system** with full CRUD operations
- **Enhanced admin navigation** with breadcrumb trails and quick action buttons
- **Rich article creation and editing** with image upload support
- **Category management** for organizing content
- **User authentication** with secure admin access
- **Article preview** and publishing controls
- **Dashboard analytics** showing article counts and status
- **Quick access buttons** for common tasks (Create Article, Manage Categories, Media Library)
- **Improved admin interface** with better visual feedback and user experience

### Enhanced User Experience
- **Advanced search** with keyword matching across title, content, and excerpts
- **Social sharing integration** with copy-to-clipboard functionality
- **Visual category browsing** with color-coded category cards
- **Related articles** suggestions on individual article pages
- **Improved navigation** with search bar in header
- **Content overview widgets** showing site statistics
- **Enhanced article cards** with author avatars and improved typography

### Technical Features
- **Next.js 15** with App Router and TypeScript
- **Prisma ORM** with SQLite database (easily upgradeable to PostgreSQL)
- **NextAuth.js** for secure authentication
- **Tailwind CSS** for responsive styling with custom animations
- **Image optimization** with Next.js Image component and fallback handling
- **File upload** functionality for featured images
- **Server-side rendering** for optimal performance
- **Advanced search API** with pagination and filtering
- **Social sharing APIs** with multiple platform support

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Create and migrate database
   npx prisma db push

   # Seed with initial data
   npm run db:seed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   - **Public site:** http://localhost:3000
   - **Admin dashboard:** http://localhost:3000/admin

## Default Admin Credentials

- **Email:** admin@pontigram.com
- **Password:** admin123

## Usage Guide

### Public News Portal
1. **Homepage:**
   - View the hero section featuring the latest article
   - Browse enhanced article cards with improved visuals
   - Access content overview statistics
   - Navigate using the enhanced header with search functionality

2. **Article Pages:**
   - Read full articles with enhanced typography
   - Use floating social media share buttons (left side on desktop)
   - View related articles suggestions
   - Share via Facebook, Twitter, LinkedIn, WhatsApp, or Email
   - Copy article URLs to clipboard

3. **Categories Page (`/categories`):**
   - Browse visual category cards with gradient backgrounds
   - See latest article previews for each category
   - View article counts per category
   - Navigate to specific category pages

4. **Category Pages:**
   - Filter articles by specific categories
   - Enhanced article listings with improved layouts
   - Category-specific navigation and breadcrumbs

5. **Search Functionality:**
   - Use the search icon in the header to open search modal
   - Search across article titles, content, and excerpts
   - View paginated search results at `/search`
   - Advanced search with keyword highlighting

6. **Responsive Design:** Optimized for mobile, tablet, and desktop viewing

### Admin Dashboard
1. **Enhanced Navigation:**
   - Access via prominent "Admin Dashboard" button in header
   - Use breadcrumb navigation within admin sections
   - Quick action buttons for common tasks

2. **Dashboard Overview (`/admin`):**
   - View comprehensive article statistics
   - Access quick action buttons (Create Article, Manage Categories, Media Library)
   - Monitor published vs draft article counts
   - Enhanced admin interface with better visual feedback

3. **Article Management:**
   - **Create Articles:** Click "Create Article" quick action button
   - **Enhanced Editor:** Improved article creation form with better UX
   - **Image Upload:** Upload and preview featured images
   - **Publishing Controls:** Toggle between draft and published status
   - **Category Selection:** Choose from available categories

4. **Content Organization:**
   - **Edit Articles:** Click "Edit" on any article with improved interface
   - **Delete Articles:** Remove articles with confirmation dialogs
   - **Category Management:** Access via "Manage Categories" button
   - **Media Library:** Organize uploaded images (via "Media Library" button)
