-- Insert admin user dan categories untuk Pontigram News
-- Migration: insert_admin_and_categories.sql

-- Insert admin user dengan password hash untuk 'admin123'
-- Password hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXIG.JOOdS8u
INSERT INTO "users" ("email", "password", "name", "role")
VALUES (
  'admin@pontigram.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXIG.JOOdS8u',
  'Administrator',
  'ADMIN'
) ON CONFLICT ("email") DO UPDATE SET
  "password" = EXCLUDED."password",
  "name" = EXCLUDED."name",
  "role" = EXCLUDED."role",
  "updatedAt" = CURRENT_TIMESTAMP;

-- Insert default categories
INSERT INTO "categories" ("name", "slug", "description")
VALUES
  ('Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini'),
  ('Politik', 'politik', 'Berita politik dan pemerintahan'),
  ('Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis'),
  ('Olahraga', 'olahraga', 'Berita olahraga dan kompetisi'),
  ('Teknologi', 'teknologi', 'Berita teknologi dan inovasi'),
  ('Budaya Melayu', 'budaya-melayu', 'Berita budaya dan tradisi Melayu'),
  ('Pariwisata', 'pariwisata', 'Berita pariwisata dan destinasi'),
  ('Pendidikan', 'pendidikan', 'Berita pendidikan dan akademik')
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;