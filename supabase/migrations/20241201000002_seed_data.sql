-- Seed data for Pontigram News
-- This migration populates initial categories and admin user

-- Insert initial categories
INSERT INTO "categories" ("id", "name", "slug", "description") VALUES
  ('cat_berita_terkini', 'Berita Terkini', 'berita-terkini', 'Berita terbaru dan terkini dari Pontianak dan sekitarnya'),
  ('cat_budaya_melayu', 'Budaya Melayu', 'budaya-melayu', 'Budaya dan tradisi Melayu Pontianak'),
  ('cat_pariwisata', 'Pariwisata', 'pariwisata', 'Destinasi wisata dan pariwisata Pontianak'),
  ('cat_ekonomi', 'Ekonomi', 'ekonomi', 'Berita ekonomi dan bisnis lokal'),
  ('cat_olahraga', 'Olahraga', 'olahraga', 'Berita olahraga dan prestasi atlet lokal'),
  ('cat_pendidikan', 'Pendidikan', 'pendidikan', 'Berita pendidikan dan dunia akademis'),
  ('cat_kesehatan', 'Kesehatan', 'kesehatan', 'Informasi kesehatan dan medis'),
  ('cat_teknologi', 'Teknologi', 'teknologi', 'Perkembangan teknologi dan digital')
ON CONFLICT ("slug") DO NOTHING;

-- Insert admin user (password: admin123 - hashed with bcrypt)
INSERT INTO "users" ("id", "email", "name", "password", "role") VALUES
  ('user_admin', 'admin@pontigram.com', 'Administrator', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9S2', 'ADMIN')
ON CONFLICT ("email") DO NOTHING;

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
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
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
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    'user_admin',
    'cat_pariwisata'
  )
ON CONFLICT ("slug") DO NOTHING;
