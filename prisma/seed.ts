import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pontigram.com' },
    update: {},
    create: {
      email: 'admin@pontigram.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  // Create categories - Kategori Berita Lokal Indonesia
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'berita-terkini' },
      update: {},
      create: {
        name: 'Berita Terkini',
        slug: 'berita-terkini',
        description: 'Berita terbaru dan terkini dari berbagai daerah'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'budaya-melayu' },
      update: {},
      create: {
        name: 'Budaya Melayu',
        slug: 'budaya-melayu',
        description: 'Warisan budaya dan tradisi Melayu yang kaya'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'pariwisata' },
      update: {},
      create: {
        name: 'Pariwisata',
        slug: 'pariwisata',
        description: 'Destinasi wisata dan potensi pariwisata daerah'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'ekonomi-bisnis' },
      update: {},
      create: {
        name: 'Ekonomi dan Bisnis',
        slug: 'ekonomi-bisnis',
        description: 'Perkembangan ekonomi dan dunia bisnis lokal'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'lingkungan' },
      update: {},
      create: {
        name: 'Lingkungan',
        slug: 'lingkungan',
        description: 'Isu lingkungan dan konservasi alam'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'kuliner-khas' },
      update: {},
      create: {
        name: 'Kuliner Khas',
        slug: 'kuliner-khas',
        description: 'Kuliner tradisional dan makanan khas daerah'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'sejarah-nostalgia' },
      update: {},
      create: {
        name: 'Sejarah dan Nostalgia',
        slug: 'sejarah-nostalgia',
        description: 'Sejarah dan kenangan masa lalu yang berharga'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'komunitas-gaya-hidup' },
      update: {},
      create: {
        name: 'Komunitas dan Gaya Hidup',
        slug: 'komunitas-gaya-hidup',
        description: 'Kehidupan komunitas dan gaya hidup masyarakat'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'pendidikan-pemuda' },
      update: {},
      create: {
        name: 'Pendidikan dan Pemuda',
        slug: 'pendidikan-pemuda',
        description: 'Dunia pendidikan dan aktivitas generasi muda'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'olahraga' },
      update: {},
      create: {
        name: 'Olahraga',
        slug: 'olahraga',
        description: 'Berita olahraga dan prestasi atlet daerah'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'kesehatan' },
      update: {},
      create: {
        name: 'Kesehatan',
        slug: 'kesehatan',
        description: 'Informasi kesehatan dan tips hidup sehat'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'hiburan-seni' },
      update: {},
      create: {
        name: 'Hiburan dan Seni',
        slug: 'hiburan-seni',
        description: 'Dunia hiburan dan perkembangan seni budaya'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'teknologi-inovasi' },
      update: {},
      create: {
        name: 'Teknologi dan Inovasi',
        slug: 'teknologi-inovasi',
        description: 'Perkembangan teknologi dan inovasi terbaru'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'agenda-acara' },
      update: {},
      create: {
        name: 'Agenda dan Acara',
        slug: 'agenda-acara',
        description: 'Agenda kegiatan dan acara-acara penting'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'opini-warga' },
      update: {},
      create: {
        name: 'Opini Warga',
        slug: 'opini-warga',
        description: 'Opini dan pandangan masyarakat tentang berbagai isu'
      }
    })
  ])

  // Create sample articles - Artikel Berita Lokal Indonesia
  const articles = [
    {
      title: 'Festival Budaya Melayu 2024 Sukses Digelar di Tanjungpinang',
      slug: 'festival-budaya-melayu-2024-sukses-digelar-tanjungpinang',
      content: '<p>Festival Budaya Melayu 2024 yang digelar di Tanjungpinang berhasil menarik ribuan pengunjung dari berbagai daerah. Acara yang berlangsung selama tiga hari ini menampilkan berbagai pertunjukan seni tradisional, pameran kerajinan, dan kuliner khas Melayu.</p><p>Gubernur Kepulauan Riau dalam sambutannya menyatakan bahwa festival ini merupakan wujud komitmen pemerintah dalam melestarikan budaya Melayu. "Kita harus bangga dengan warisan budaya yang kita miliki dan terus melestarikannya untuk generasi mendatang," ujarnya.</p><p>Berbagai pertunjukan menarik seperti tari Zapin, musik Gambus, dan teater tradisional berhasil memukau pengunjung. Selain itu, pameran kerajinan tangan seperti songket, ukiran kayu, dan anyaman pandan juga menjadi daya tarik tersendiri.</p>',
      excerpt: 'Festival Budaya Melayu 2024 di Tanjungpinang sukses menarik ribuan pengunjung dengan berbagai pertunjukan seni tradisional.',
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[1].id
    },
    {
      title: 'Destinasi Wisata Pulau Penyengat Ramai Dikunjungi Wisatawan',
      slug: 'destinasi-wisata-pulau-penyengat-ramai-dikunjungi-wisatawan',
      content: '<p>Pulau Penyengat yang terkenal sebagai pulau bersejarah di Kepulauan Riau kembali ramai dikunjungi wisatawan, terutama pada akhir pekan. Pulau yang dijuluki "Pulau Kuning" ini menawarkan pesona sejarah dan budaya yang tak terlupakan.</p><p>Kepala Dinas Pariwisata Kepulauan Riau menyatakan bahwa kunjungan wisatawan ke Pulau Penyengat mengalami peningkatan signifikan. "Kami terus berupaya meningkatkan fasilitas dan promosi untuk menarik lebih banyak wisatawan," ujarnya.</p><p>Objek wisata utama di pulau ini antara lain Masjid Raya Sultan Riau, Makam Raja Ali Haji, dan berbagai bangunan bersejarah lainnya. Wisatawan juga dapat menikmati kuliner khas dan berinteraksi dengan masyarakat lokal yang ramah.</p>',
      excerpt: 'Pulau Penyengat menjadi destinasi wisata favorit dengan pesona sejarah dan budaya yang menarik.',
      published: true,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      authorId: admin.id,
      categoryId: categories[2].id
    },
    {
      title: 'UMKM Kuliner Tradisional Tumbuh Pesat di Era Digital',
      slug: 'umkm-kuliner-tradisional-tumbuh-pesat-era-digital',
      content: '<p>Usaha Mikro Kecil dan Menengah (UMKM) di bidang kuliner tradisional mengalami pertumbuhan yang pesat berkat pemanfaatan teknologi digital. Banyak pelaku UMKM yang kini memanfaatkan platform online untuk memasarkan produk mereka.</p><p>Dinas Koperasi dan UMKM mencatat bahwa sektor kuliner tradisional menjadi salah satu yang paling adaptif terhadap perubahan teknologi. "Para pelaku UMKM kuliner sangat kreatif dalam memanfaatkan media sosial dan platform e-commerce," kata Kepala Dinas.</p><p>Beberapa produk kuliner tradisional yang sukses dipasarkan secara online antara lain kerupuk ikan, dodol durian, dan berbagai jenis kue tradisional. Hal ini tidak hanya meningkatkan pendapatan, tetapi juga membantu melestarikan kuliner tradisional.</p>',
      excerpt: 'UMKM kuliner tradisional berkembang pesat dengan memanfaatkan teknologi digital dan platform online.',
      published: true,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      authorId: admin.id,
      categoryId: categories[3].id
    },
    {
      title: 'Program Konservasi Mangrove Berhasil Pulihkan Ekosistem Pesisir',
      slug: 'program-konservasi-mangrove-berhasil-pulihkan-ekosistem-pesisir',
      content: '<p>Program konservasi mangrove yang dijalankan selama tiga tahun terakhir berhasil memulihkan ekosistem pesisir di beberapa wilayah. Upaya penanaman dan pemeliharaan mangrove ini melibatkan partisipasi aktif masyarakat lokal.</p><p>Kepala Dinas Lingkungan Hidup menyatakan bahwa program ini tidak hanya berdampak pada kelestarian lingkungan, tetapi juga meningkatkan ekonomi masyarakat pesisir. "Mangrove yang sehat akan mendukung kehidupan ikan dan udang, sehingga nelayan juga merasakan manfaatnya," jelasnya.</p><p>Selain itu, kawasan mangrove yang telah dipulihkan juga menjadi destinasi ekowisata yang menarik. Wisatawan dapat menikmati keindahan alam sambil belajar tentang pentingnya konservasi lingkungan.</p>',
      excerpt: 'Program konservasi mangrove berhasil memulihkan ekosistem pesisir dan meningkatkan ekonomi masyarakat.',
      published: true,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      authorId: admin.id,
      categoryId: categories[4].id
    },
    {
      title: 'Rendang Daging Sapi Khas Daerah Raih Penghargaan Kuliner Terbaik',
      slug: 'rendang-daging-sapi-khas-daerah-raih-penghargaan-kuliner-terbaik',
      content: '<p>Rendang daging sapi khas daerah berhasil meraih penghargaan sebagai kuliner terbaik dalam festival kuliner nusantara yang digelar di Jakarta. Penghargaan ini diberikan berdasarkan penilaian dari para chef profesional dan food blogger ternama.</p><p>Ibu Siti, pemilik warung rendang yang meraih penghargaan, mengungkapkan bahwa resep rendang yang digunakan merupakan warisan turun-temurun dari neneknya. "Kunci kelezatan rendang terletak pada bumbu rempah yang lengkap dan proses memasak yang sabar," ujarnya.</p><p>Penghargaan ini diharapkan dapat meningkatkan popularitas kuliner khas daerah dan mendorong lebih banyak wisatawan untuk mencicipi kelezatan rendang autentik.</p>',
      excerpt: 'Rendang daging sapi khas daerah meraih penghargaan kuliner terbaik dalam festival kuliner nusantara.',
      published: true,
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
      authorId: admin.id,
      categoryId: categories[5].id
    },
    {
      title: 'Museum Sejarah Lokal Luncurkan Program Edukasi Digital',
      slug: 'museum-sejarah-lokal-luncurkan-program-edukasi-digital',
      content: '<p>Museum Sejarah Lokal meluncurkan program edukasi digital yang memungkinkan pengunjung untuk menjelajahi koleksi sejarah melalui teknologi virtual reality dan augmented reality. Program ini bertujuan untuk menarik minat generasi muda terhadap sejarah.</p><p>Direktur museum menjelaskan bahwa program ini merupakan inovasi dalam penyajian materi sejarah. "Dengan teknologi digital, pengunjung dapat merasakan pengalaman sejarah secara lebih interaktif dan menarik," katanya.</p><p>Program edukasi digital ini mencakup tur virtual ke berbagai periode sejarah, rekonstruksi 3D bangunan bersejarah, dan permainan edukatif yang mengajarkan nilai-nilai sejarah kepada anak-anak.</p>',
      excerpt: 'Museum sejarah meluncurkan program edukasi digital dengan teknologi VR dan AR untuk menarik generasi muda.',
      published: true,
      publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30 hours ago
      authorId: admin.id,
      categoryId: categories[6].id
    },
    {
      title: 'Komunitas Pecinta Alam Gelar Aksi Bersih Pantai Bersama',
      slug: 'komunitas-pecinta-alam-gelar-aksi-bersih-pantai-bersama',
      content: '<p>Komunitas pecinta alam dari berbagai daerah menggelar aksi bersih pantai bersama yang diikuti oleh ratusan relawan. Kegiatan ini bertujuan untuk menjaga kelestarian lingkungan pantai dan meningkatkan kesadaran masyarakat tentang pentingnya menjaga kebersihan laut.</p><p>Ketua komunitas menyatakan bahwa aksi ini merupakan bentuk kepedulian terhadap lingkungan. "Pantai yang bersih tidak hanya indah dipandang, tetapi juga mendukung kehidupan biota laut," jelasnya.</p><p>Selain membersihkan sampah, kegiatan ini juga diisi dengan edukasi tentang pengelolaan sampah yang baik dan kampanye penggunaan produk ramah lingkungan. Para peserta juga menanam pohon mangrove di sepanjang garis pantai.</p>',
      excerpt: 'Komunitas pecinta alam menggelar aksi bersih pantai untuk menjaga kelestarian lingkungan laut.',
      published: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      authorId: admin.id,
      categoryId: categories[7].id
    },
    {
      title: 'Sekolah Dasar Raih Prestasi Juara Olimpiade Sains Nasional',
      slug: 'sekolah-dasar-raih-prestasi-juara-olimpiade-sains-nasional',
      content: '<p>Sekolah Dasar Negeri 15 berhasil meraih prestasi membanggakan dengan menjuarai Olimpiade Sains Nasional tingkat sekolah dasar. Prestasi ini merupakan hasil kerja keras siswa dan dukungan penuh dari guru-guru yang berdedikasi.</p><p>Kepala sekolah mengungkapkan rasa bangganya atas pencapaian siswa-siswanya. "Prestasi ini membuktikan bahwa dengan bimbingan yang tepat dan semangat belajar yang tinggi, anak-anak kita mampu bersaing di tingkat nasional," ujarnya.</p><p>Para siswa yang meraih juara akan mendapat beasiswa pendidikan dan kesempatan untuk mengikuti program pengembangan bakat sains. Sekolah juga berencana mengembangkan laboratorium sains yang lebih lengkap untuk mendukung pembelajaran.</p>',
      excerpt: 'SD Negeri 15 meraih juara Olimpiade Sains Nasional berkat kerja keras siswa dan dukungan guru.',
      published: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      authorId: admin.id,
      categoryId: categories[8].id
    },
    {
      title: 'Tim Sepak Bola Lokal Promosi ke Liga yang Lebih Tinggi',
      slug: 'tim-sepak-bola-lokal-promosi-ke-liga-yang-lebih-tinggi',
      content: '<p>Tim sepak bola lokal berhasil meraih promosi ke liga yang lebih tinggi setelah menunjukkan performa yang konsisten sepanjang musim. Pencapaian ini merupakan hasil kerja keras seluruh tim dan dukungan penuh dari suporter setia.</p><p>Pelatih tim mengungkapkan kebanggaannya atas pencapaian ini. "Promosi ini adalah hasil dari latihan keras, disiplin, dan semangat pantang menyerah dari seluruh pemain," katanya.</p><p>Manajemen klub berencana untuk memperkuat skuad dengan mendatangkan beberapa pemain baru dan meningkatkan fasilitas latihan. Dukungan dari pemerintah daerah dan sponsor lokal juga sangat membantu perkembangan tim.</p>',
      excerpt: 'Tim sepak bola lokal berhasil promosi ke liga yang lebih tinggi berkat performa konsisten.',
      published: true,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      authorId: admin.id,
      categoryId: categories[9].id
    },
    {
      title: 'Puskesmas Luncurkan Program Pemeriksaan Kesehatan Gratis',
      slug: 'puskesmas-luncurkan-program-pemeriksaan-kesehatan-gratis',
      content: '<p>Puskesmas setempat meluncurkan program pemeriksaan kesehatan gratis untuk masyarakat yang bertujuan untuk meningkatkan kesadaran akan pentingnya deteksi dini penyakit. Program ini mencakup pemeriksaan tekanan darah, gula darah, dan kolesterol.</p><p>Kepala Puskesmas menyatakan bahwa program ini merupakan upaya preventif untuk mengurangi angka penyakit tidak menular di masyarakat. "Dengan deteksi dini, kita dapat mencegah penyakit berkembang menjadi lebih serius," jelasnya.</p><p>Antusiasme masyarakat terhadap program ini sangat tinggi, terbukti dari banyaknya warga yang datang untuk memeriksakan kesehatan. Puskesmas juga memberikan edukasi tentang pola hidup sehat dan pentingnya olahraga teratur.</p>',
      excerpt: 'Puskesmas meluncurkan program pemeriksaan kesehatan gratis untuk meningkatkan kesadaran masyarakat.',
      published: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      authorId: admin.id,
      categoryId: categories[10].id
    },
    {
      title: 'Pertunjukan Teater Tradisional Menarik Perhatian Generasi Muda',
      slug: 'pertunjukan-teater-tradisional-menarik-perhatian-generasi-muda',
      content: '<p>Pertunjukan teater tradisional yang digelar di gedung kesenian berhasil menarik perhatian generasi muda. Pertunjukan ini menampilkan cerita rakyat klasik dengan sentuhan modern yang membuatnya lebih relevan dengan zaman sekarang.</p><p>Sutradara pertunjukan menjelaskan bahwa tujuan utama adalah memperkenalkan seni teater tradisional kepada generasi muda. "Kami ingin menunjukkan bahwa seni tradisional bisa dikemas dengan cara yang menarik dan tidak membosankan," ujarnya.</p><p>Para penonton, terutama anak muda, memberikan respons positif terhadap pertunjukan ini. Mereka mengapresiasi kreativitas dalam penyajian cerita dan kualitas akting para pemain yang memukau.</p>',
      excerpt: 'Pertunjukan teater tradisional dengan sentuhan modern berhasil menarik minat generasi muda.',
      published: true,
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      authorId: admin.id,
      categoryId: categories[11].id
    },
    {
      title: 'Startup Teknologi Lokal Kembangkan Aplikasi Edukasi Inovatif',
      slug: 'startup-teknologi-lokal-kembangkan-aplikasi-edukasi-inovatif',
      content: '<p>Startup teknologi lokal berhasil mengembangkan aplikasi edukasi inovatif yang membantu siswa belajar dengan metode yang lebih interaktif dan menyenangkan. Aplikasi ini menggunakan teknologi gamifikasi untuk meningkatkan motivasi belajar.</p><p>CEO startup menjelaskan bahwa aplikasi ini dirancang khusus untuk memenuhi kebutuhan pendidikan di Indonesia. "Kami ingin memberikan solusi teknologi yang dapat membantu meningkatkan kualitas pendidikan di tanah air," katanya.</p><p>Aplikasi ini telah diujicoba di beberapa sekolah dan mendapat respons positif dari guru dan siswa. Fitur-fitur unggulan termasuk pembelajaran adaptif, kuis interaktif, dan sistem reward yang memotivasi siswa untuk terus belajar.</p>',
      excerpt: 'Startup lokal mengembangkan aplikasi edukasi inovatif dengan teknologi gamifikasi untuk siswa.',
      published: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      authorId: admin.id,
      categoryId: categories[12].id
    },
    {
      title: 'Pembangunan Jembatan Baru Akan Dimulai Bulan Depan',
      slug: 'pembangunan-jembatan-baru-akan-dimulai-bulan-depan',
      content: '<p>Pemerintah daerah mengumumkan bahwa pembangunan jembatan baru yang menghubungkan dua wilayah penting akan dimulai bulan depan. Proyek ini diharapkan dapat meningkatkan konektivitas dan mendorong pertumbuhan ekonomi di kedua wilayah.</p><p>Kepala Dinas Pekerjaan Umum menyatakan bahwa pembangunan jembatan ini merupakan prioritas utama pemerintah daerah. "Jembatan ini akan mempersingkat waktu tempuh dan memudahkan mobilitas masyarakat," jelasnya.</p><p>Proyek pembangunan jembatan ini diperkirakan akan selesai dalam waktu 18 bulan dengan anggaran yang telah dialokasikan dari APBD. Selama masa pembangunan, akan disediakan jalur alternatif untuk meminimalkan gangguan lalu lintas.</p>',
      excerpt: 'Pembangunan jembatan baru akan dimulai bulan depan untuk meningkatkan konektivitas antar wilayah.',
      published: true,
      publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      authorId: admin.id,
      categoryId: categories[0].id
    },
    {
      title: 'Festival Kuliner Tradisional Akan Digelar Akhir Bulan Ini',
      slug: 'festival-kuliner-tradisional-akan-digelar-akhir-bulan-ini',
      content: '<p>Festival Kuliner Tradisional akan digelar pada akhir bulan ini di alun-alun kota dengan menampilkan berbagai makanan khas daerah. Acara ini diharapkan dapat mempromosikan kekayaan kuliner lokal dan meningkatkan kunjungan wisatawan.</p><p>Panitia penyelenggara menyatakan bahwa festival ini akan menghadirkan lebih dari 50 stand makanan dari berbagai daerah. "Pengunjung dapat menikmati berbagai kuliner autentik dengan harga yang terjangkau," kata ketua panitia.</p><p>Selain pameran kuliner, festival ini juga akan menghadirkan pertunjukan musik tradisional, demo memasak oleh chef terkenal, dan kompetisi kuliner untuk masyarakat umum. Tiket masuk gratis untuk semua pengunjung.</p>',
      excerpt: 'Festival Kuliner Tradisional akan digelar akhir bulan ini dengan 50 stand makanan khas daerah.',
      published: true,
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      authorId: admin.id,
      categoryId: categories[13].id
    },
    {
      title: 'Pentingnya Menjaga Kelestarian Budaya Lokal di Era Modern',
      slug: 'pentingnya-menjaga-kelestarian-budaya-lokal-di-era-modern',
      content: '<p>Di era modernisasi yang semakin pesat, menjaga kelestarian budaya lokal menjadi tantangan tersendiri bagi masyarakat. Banyak tradisi dan kebudayaan yang mulai terlupakan karena pengaruh budaya asing dan perkembangan teknologi.</p><p>Sebagai warga yang peduli terhadap warisan budaya, kita harus berperan aktif dalam melestarikan tradisi nenek moyang. Hal ini dapat dilakukan melalui berbagai cara, seperti mengajarkan kepada generasi muda, mengikuti kegiatan budaya, dan mendukung seniman lokal.</p><p>Pemerintah juga perlu memberikan dukungan yang lebih besar dalam bentuk program pelestarian budaya, fasilitas yang memadai, dan promosi yang efektif. Dengan kerjasama semua pihak, budaya lokal dapat tetap lestari dan menjadi kebanggaan daerah.</p>',
      excerpt: 'Opini tentang pentingnya menjaga kelestarian budaya lokal di tengah arus modernisasi.',
      published: true,
      publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
      authorId: admin.id,
      categoryId: categories[14].id
    }
  ]

  for (const articleData of articles) {
    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {},
      create: articleData
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
