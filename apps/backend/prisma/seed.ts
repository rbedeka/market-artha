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
        name: 'Alice Johnson',
        password: hashedPassword,
      },
      {
        email: 'bob@example.com',
        username: 'bob',
        name: 'Bob Smith',
        password: hashedPassword,
      },
      {
        email: 'charlie@example.com',
        username: 'charlie',
        name: 'Charlie Brown',
        password: hashedPassword,
      },
      {
        email: 'diana@example.com',
        username: 'diana',
        name: 'Diana Prince',
        password: hashedPassword,
      },
      {
        email: 'eve@example.com',
        username: 'eve',
        name: 'Eve Wilson',
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
    console.log(`  - ${user.email} (${user.name})`);
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
