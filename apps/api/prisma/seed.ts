import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Super Admin: ensure daniadhisaputro@gmail.com is super_admin
  const superAdminEmail = 'daniadhisaputro@gmail.com';
  const superAdmin = await prisma.user.findUnique({ where: { email: superAdminEmail } });

  if (superAdmin) {
    if (superAdmin.role !== 'super_admin') {
      await prisma.user.update({
        where: { email: superAdminEmail },
        data: { role: 'super_admin' },
      });
      console.log(`Updated ${superAdminEmail} to super_admin`);
    } else {
      console.log(`${superAdminEmail} already super_admin`);
    }
  } else {
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: null,
        name: 'Dani Super Admin',
        role: 'super_admin',
      },
    });
    console.log(`Created ${superAdminEmail} as super_admin`);
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
