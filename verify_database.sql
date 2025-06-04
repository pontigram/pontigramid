-- Verifikasi Database Setup
-- File: verify_database.sql

-- 1. Cek tabel yang sudah dibuat
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'categories', 'articles', 'analytics')
ORDER BY table_name;

-- 2. Cek admin user
SELECT "id", "email", "name", "role", "createdAt"
FROM "users" 
WHERE "role" = 'ADMIN';

-- 3. Cek jumlah categories
SELECT COUNT(*) as total_categories
FROM "categories";

-- 4. Cek semua categories
SELECT "name", "slug", "description"
FROM "categories"
ORDER BY "name";

-- 5. Cek struktur tabel users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Test password hash admin user
SELECT "email", 
       LENGTH("password") as password_length,
       SUBSTRING("password", 1, 10) as password_prefix
FROM "users" 
WHERE "email" = 'admin@pontigram.com';
