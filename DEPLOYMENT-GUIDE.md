# 🚀 PANDUAN DEPLOYMENT PONTIGRAM NEWS

## 📋 RINGKASAN MASALAH YANG DIPERBAIKI

### ✅ Masalah yang Telah Diperbaiki:
1. **Missing Import di auth.ts** - Ditambahkan `import { prisma } from '@/lib/prisma'`
2. **Duplikasi Next.js Config** - Dihapus `next.config.ts`, menggunakan `next.config.js`
3. **Build Scripts Optimization** - Ditambahkan `vercel-build` script
4. **Environment Variables** - Dikonfigurasi untuk production
5. **Vercel Configuration** - Dioptimalkan untuk deployment

### ⚠️ Masalah yang Masih Perlu Diatasi:
1. **Vercel Authentication Protection** - Perlu dinonaktifkan manual
2. **Database Seeding** - Perlu dilakukan setelah deployment
3. **Environment Variables** - Perlu diset di Vercel Dashboard

## 🔧 LANGKAH-LANGKAH DEPLOYMENT

### FASE 1: Persiapan Lokal

1. **Jalankan Script Deployment:**
   ```bash
   ./deploy-production.sh
   ```

2. **Jika ada error, perbaiki dan ulangi:**
   ```bash
   npm install --legacy-peer-deps
   npx prisma generate
   npm run build
   ```

### FASE 2: Setup Environment Variables di Vercel

Masuk ke [Vercel Dashboard](https://vercel.com/dashboard) dan set environment variables:

```
DATABASE_URL=postgresql://postgres:121213%40PontigramOye@db.codyijlhroqgdeqqohiv.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:121213%40PontigramOye@db.codyijlhroqgdeqqohiv.supabase.co:5432/postgres
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secure-secret-key-here
ADMIN_EMAIL=admin@pontigram.com
ADMIN_PASSWORD=admin123
NODE_ENV=production
SKIP_ENV_VALIDATION=true
NEXT_TELEMETRY_DISABLED=1
```

### FASE 3: Deploy ke Vercel

1. **Commit dan Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Fix deployment issues - ready for production"
   git push origin main
   ```

2. **Deploy via Vercel CLI:**
   ```bash
   npx vercel --prod
   ```

   Atau deploy via Vercel Dashboard dengan import GitHub repository.

### FASE 4: Perbaikan Vercel Authentication

🚨 **CRITICAL**: Nonaktifkan Vercel Authentication Protection

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project `pontigram-news`
3. Masuk ke **Settings** → **Security**
4. Cari **"Vercel Authentication"** atau **"Password Protection"**
5. **DISABLE** protection tersebut
6. Save changes

### FASE 5: Database Setup

1. **Test API Endpoints:**
   ```bash
   curl https://your-domain.vercel.app/api/test
   curl https://your-domain.vercel.app/api/categories
   ```

2. **Setup Database (jika diperlukan):**
   ```bash
   # Pull environment variables
   npx vercel env pull .env.production
   
   # Setup database tables dan seed data
   npm run db:setup
   ```

## 🧪 TESTING DEPLOYMENT

### Test Endpoints:
- ✅ `GET /api/test` - Should return success message
- ✅ `GET /api/categories` - Should return categories list
- ✅ `GET /api/articles` - Should return articles list
- ✅ `GET /` - Homepage should load
- ✅ `GET /admin` - Admin dashboard should load

### Test Admin Access:
1. Buka `https://your-domain.vercel.app/admin`
2. Login dengan credentials dari environment variables
3. Test create/edit articles
4. Test breaking news ticker

## 🔍 TROUBLESHOOTING

### Jika Build Gagal:
```bash
# Clear cache dan rebuild
rm -rf .next node_modules/.cache
npm install --legacy-peer-deps
npx prisma generate
npm run build
```

### Jika API Endpoints Return 401/403:
- Pastikan Vercel Authentication DISABLED
- Check environment variables di Vercel Dashboard
- Verify database connection

### Jika Database Connection Error:
- Verify DATABASE_URL dan DIRECT_URL
- Check Supabase project status
- Test connection locally first

## 📊 MONITORING

Setelah deployment berhasil:
1. Monitor Vercel Function logs
2. Check database performance di Supabase
3. Test all features end-to-end
4. Monitor error rates dan performance

## 🎯 NEXT STEPS

Setelah deployment berhasil:
1. Setup custom domain (opsional)
2. Configure SSL certificate
3. Setup monitoring dan analytics
4. Backup database secara berkala
5. Setup staging environment untuk testing

---

**📞 Support**: Jika masih ada masalah, check logs di Vercel Dashboard dan Supabase untuk detail error.
