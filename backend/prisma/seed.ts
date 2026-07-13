import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ==================== CATEGORIES ====================
  console.log('Seeding categories...');

  const makanan = await prisma.category.create({
    data: {
      name: 'Makanan',
      slug: 'makanan',
      description: 'Produk makanan khas Cilacap',
      sortOrder: 1,
    },
  });

  const dodol = await prisma.category.create({
    data: {
      name: 'Dodol',
      slug: 'dodol',
      parentId: makanan.id,
      description: 'Dodol khas Cilacap',
      sortOrder: 1,
    },
  });

  const keripik = await prisma.category.create({
    data: {
      name: 'Keripik',
      slug: 'keripik',
      parentId: makanan.id,
      description: 'Keripik khas Cilacap',
      sortOrder: 2,
    },
  });

  const kue = await prisma.category.create({
    data: {
      name: 'Kue',
      slug: 'kue',
      parentId: makanan.id,
      description: 'Kue tradisional Cilacap',
      sortOrder: 3,
    },
  });

  const minuman = await prisma.category.create({
    data: {
      name: 'Minuman',
      slug: 'minuman',
      description: 'Minuman khas Cilacap',
      sortOrder: 2,
    },
  });

  const kopi = await prisma.category.create({
    data: {
      name: 'Kopi',
      slug: 'kopi',
      parentId: minuman.id,
      description: 'Kopi khas Cilacap',
      sortOrder: 1,
    },
  });

  const teh = await prisma.category.create({
    data: {
      name: 'Teh',
      slug: 'teh',
      parentId: minuman.id,
      description: 'Teh khas Cilacap',
      sortOrder: 2,
    },
  });

  const kerajinan = await prisma.category.create({
    data: {
      name: 'Kerajinan',
      slug: 'kerajinan',
      description: 'Kerajinan tangan Cilacap',
      sortOrder: 3,
    },
  });

  const batik = await prisma.category.create({
    data: {
      name: 'Batik',
      slug: 'batik',
      parentId: kerajinan.id,
      description: 'Batik Cilacap',
      sortOrder: 1,
    },
  });

  const anyaman = await prisma.category.create({
    data: {
      name: 'Anyaman',
      slug: 'anyaman',
      parentId: kerajinan.id,
      description: 'Anyaman Cilacap',
      sortOrder: 2,
    },
  });

  console.log('Categories seeded successfully');

  // ==================== USERS ====================
  console.log('Seeding users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sadean.com',
      password: hashedPassword,
      name: 'Admin SADEAN',
      phone: '081234567890',
      role: 'admin',
    },
  });

  // Buyer
  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@test.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '081234567891',
      role: 'buyer',
    },
  });

  // Seller
  const sellerUser = await prisma.user.create({
    data: {
      email: 'seller@test.com',
      password: hashedPassword,
      name: 'Mak Dodol',
      phone: '081234567892',
      role: 'seller',
    },
  });

  console.log('Users seeded successfully');

  // ==================== SELLERS ====================
  console.log('Seeding sellers...');

  const seller = await prisma.seller.create({
    data: {
      userId: sellerUser.id,
      storeName: 'Toko Dodol Mak',
      slug: 'toko-dodol-mak',
      description: 'Dodol khas Cilacap yang dibuat dengan bahan alami pilihan',
      address: 'Jl. Merdeka No. 1, Cilacap Tengah',
      phone: '081234567892',
      whatsapp: '6281234567892',
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  console.log('Sellers seeded successfully');

  // ==================== PRODUCTS ====================
  console.log('Seeding products...');

  const dodolCilacap = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: dodol.id,
      name: 'Dodol Cilacap Asli',
      slug: 'dodol-cilacap-asli',
      description: 'Dodol khas Cilacap yang dibuat dengan bahan alami pilihan. Rasanya manis legit dan tidak cepat basi.',
      price: 25000,
      stock: 100,
      unit: 'pcs',
      weight: 200,
    },
  });

  const keripikSingkong = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: keripik.id,
      name: 'Keripik Singkong',
      slug: 'keripik-singkong',
      description: 'Keripik singkong renyah dan gurih',
      price: 15000,
      stock: 200,
      unit: 'pcs',
      weight: 150,
    },
  });

  const kopiCilacap = await prisma.product.create({
    data: {
      sellerId: seller.id,
      categoryId: kopi.id,
      name: 'Kopi Cilacap',
      slug: 'kopi-cilacap',
      description: 'Kopi robusta khas Cilacap',
      price: 45000,
      stock: 50,
      unit: 'pcs',
      weight: 250,
    },
  });

  console.log('Products seeded successfully');

  // ==================== PRODUCT IMAGES ====================
  console.log('Seeding product images...');

  await prisma.productImage.createMany({
    data: [
      {
        productId: dodolCilacap.id,
        imageUrl: '/images/products/dodol-cilacap-1.jpg',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        productId: dodolCilacap.id,
        imageUrl: '/images/products/dodol-cilacap-2.jpg',
        isPrimary: false,
        sortOrder: 2,
      },
      {
        productId: keripikSingkong.id,
        imageUrl: '/images/products/keripik-singkong-1.jpg',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        productId: kopiCilacap.id,
        imageUrl: '/images/products/kopi-cilacap-1.jpg',
        isPrimary: true,
        sortOrder: 1,
      },
    ],
  });

  console.log('Product images seeded successfully');

  // ==================== ADDRESSES ====================
  console.log('Seeding addresses...');

  await prisma.address.create({
    data: {
      userId: buyer.id,
      name: 'John Doe',
      phone: '081234567891',
      addressLine1: 'Jl. Sudirman No. 10',
      addressLine2: 'RT 01/RW 02',
      city: 'Cilacap',
      province: 'Jawa Tengah',
      postalCode: '53211',
      isDefault: true,
    },
  });

  console.log('Addresses seeded successfully');

  // ==================== BANNERS ====================
  console.log('Seeding banners...');

  await prisma.banner.createMany({
    data: [
      {
        title: 'Selamat Datang di SADEAN',
        imageUrl: '/images/banners/welcome.jpg',
        link: '/',
        isActive: true,
        sortOrder: 1,
      },
      {
        title: 'Produk Baru',
        imageUrl: '/images/banners/new-products.jpg',
        link: '/products',
        isActive: true,
        sortOrder: 2,
      },
    ],
  });

  console.log('Banners seeded successfully');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });