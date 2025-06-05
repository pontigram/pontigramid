-- Complete Database Setup for Pontigram News
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS "articles" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Create users table
CREATE TABLE "users" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create categories table
CREATE TABLE "categories" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Create articles table
CREATE TABLE "articles" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featuredImage" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "isBreakingNews" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "authorId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  CONSTRAINT "articles_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "articles_published_idx" ON "articles"("published");
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");
CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");
CREATE INDEX "articles_slug_idx" ON "articles"("slug");
CREATE INDEX "categories_slug_idx" ON "categories"("slug");
CREATE INDEX "users_email_idx" ON "users"("email");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON "articles" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial categories
INSERT INTO "categories" ("id", "name", "slug", "description") VALUES
  ('cat_berita_terkini', 'Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini dari Pontianak dan sekitarnya'),
  ('cat_budaya_melayu', 'Budaya Melayu', 'budaya-melayu', 'Budaya dan tradisi Melayu Pontianak'),
  ('cat_pariwisata', 'Pariwisata', 'pariwisata', 'Destinasi wisata dan pariwisata Pontianak'),
  ('cat_ekonomi', 'Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis lokal'),
  ('cat_olahraga', 'Olahraga', 'olahraga', 'Berita olahraga dan prestasi atlet lokal'),
  ('cat_pendidikan', 'Pendidikan', 'pendidikan', 'Berita pendidikan dan dunia akademis'),
  ('cat_kesehatan', 'Kesehatan', 'kesehatan', 'Informasi kesehatan dan medis'),
  ('cat_teknologi', 'Teknologi', 'teknologi', 'Perkembangan teknologi dan digital');

-- Insert admin user (password: admin123 - hashed with bcrypt)
INSERT INTO "users" ("id", "email", "name", "password", "role") VALUES
  ('user_admin', 'admin@pontigram.com', 'Administrator', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'ADMIN');

-- Insert sample articles
INSERT INTO "articles" ("id", "title", "slug", "content", "excerpt", "published", "isBreakingNews", "publishedAt", "authorId", "categoryId") VALUES
  (
    'article_welcome',
    'Selamat Datang di Pontigram News',
    'selamat-datang-pontigram-news',
    '<p>Selamat datang di <strong>Pontigram News</strong>, portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya.</p>

<p>Kami berkomitmen untuk menyajikan berita yang akurat, terpercaya, dan up-to-date mengenai berbagai aspek kehidupan di Kalimantan Barat, khususnya Pontianak.</p>

<h3>Kategori Berita Kami:</h3>
<ul>
<li><strong>Berita Terkini</strong> - Update terbaru dari berbagai sektor</li>
<li><strong>Budaya Melayu</strong> - Pelestarian dan pengembangan budaya lokal</li>
<li><strong>Pariwisata</strong> - Destinasi wisata menarik di Kalimantan Barat</li>
<li><strong>Ekonomi</strong> - Perkembangan ekonomi dan bisnis lokal</li>
<li><strong>Olahraga</strong> - Prestasi atlet dan event olahraga</li>
</ul>

<p>Terima kasih telah mempercayai Pontigram News sebagai sumber informasi Anda.</p>',
    'Portal berita terpercaya untuk informasi terkini dari Pontianak dan sekitarnya. Kami menyajikan berita akurat dan up-to-date.',
    true,
    false,
    CURRENT_TIMESTAMP,
    'user_admin',
    'cat_berita_terkini'
  ),
  (
    'article_budaya_melayu',
    'Kekayaan Budaya Melayu Pontianak yang Perlu Dilestarikan',
    'kekayaan-budaya-melayu-pontianak',
    '<p>Pontianak sebagai ibu kota Kalimantan Barat memiliki <strong>kekayaan budaya Melayu</strong> yang sangat beragam dan perlu dilestarikan untuk generasi mendatang.</p>

<h3>Tradisi yang Masih Lestari:</h3>
<ul>
<li><strong>Tari Zapin</strong> - Tarian tradisional yang menggambarkan keanggunan budaya Melayu</li>
<li><strong>Musik Gambus</strong> - Alat musik tradisional yang masih dimainkan</li>
<li><strong>Kuliner Khas</strong> - Makanan tradisional seperti Bubur Pedas dan Chai Kwe</li>
<li><strong>Arsitektur Rumah Melayu</strong> - Rumah panggung dengan ciri khas tersendiri</li>
</ul>

<p>Pelestarian budaya ini menjadi tanggung jawab bersama untuk mempertahankan identitas lokal di tengah arus modernisasi.</p>',
    'Pontianak memiliki kekayaan budaya Melayu yang sangat beragam, dari tarian, musik, kuliner, hingga arsitektur tradisional.',
    true,
    false,
    CURRENT_TIMESTAMP - INTERVAL ''1 hour'',
    'user_admin',
    'cat_budaya_melayu'
  ),
  (
    'article_pariwisata',
    'Destinasi Wisata Menarik di Pontianak yang Wajib Dikunjungi',
    'destinasi-wisata-menarik-pontianak',
    '<p>Pontianak menawarkan berbagai <strong>destinasi wisata menarik</strong> yang memadukan keindahan alam, sejarah, dan budaya lokal.</p>

<h3>Tempat Wisata Populer:</h3>
<ul>
<li><strong>Tugu Khatulistiwa</strong> - Landmark terkenal yang menandai garis khatulistiwa</li>
<li><strong>Sungai Kapuas</strong> - Sungai terpanjang di Indonesia dengan pemandangan menawan</li>
<li><strong>Masjid Jami Sultan Syarif Abdurrahman</strong> - Masjid bersejarah dengan arsitektur indah</li>
<li><strong>Museum Provinsi Kalimantan Barat</strong> - Koleksi sejarah dan budaya daerah</li>
<li><strong>Kampung Beting</strong> - Wisata kuliner dan budaya tepi sungai</li>
</ul>

<p>Setiap destinasi menawarkan pengalaman unik yang menggambarkan kekayaan alam dan budaya Kalimantan Barat.</p>',
    'Pontianak menawarkan destinasi wisata menarik yang memadukan keindahan alam, sejarah, dan budaya lokal yang wajib dikunjungi.',
    true,
    false,
    CURRENT_TIMESTAMP - INTERVAL ''2 hours'',
    'user_admin',
    'cat_pariwisata'
  );

-- Display setup completion message
SELECT 'Database setup completed successfully!' as message;
SELECT COUNT(*) as user_count FROM "users";
SELECT COUNT(*) as category_count FROM "categories";
SELECT COUNT(*) as article_count FROM "articles";
