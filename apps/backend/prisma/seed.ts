import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('🌱 Starting seed...');

  // Hash password for all seed users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing users (optional - comment out if you want to keep existing data)
  await prisma.user.deleteMany({});
  console.log('✓ Cleared existing users');

  // Create seed users
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'alice@example.com',
        username: 'alice',
        role: 'admin',
        password: hashedPassword,
      },
      {
        email: 'bob@example.com',
        username: 'bob',
        role: 'user',
        password: hashedPassword,
      },
      {
        email: 'charlie@example.com',
        username: 'charlie',
        role: 'user',
        password: hashedPassword,
      },
      {
        email: 'diana@example.com',
        username: 'diana',
        role: 'user',
        password: hashedPassword,
      },
      {
        email: 'eve@example.com',
        username: 'eve',
        role: 'user',
        password: hashedPassword,
      },
    ],
  });

  console.log(`✓ Created ${users.count} seed users`);

  // Verify users were created
  const allUsers = await prisma.user.findMany();
  console.log(`✓ Total users in database: ${allUsers.length}`);
  console.log('📋 Seeded users:');
  allUsers.forEach((user) => {
    console.log(`  - ${user.email} (${user.role})`);
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
