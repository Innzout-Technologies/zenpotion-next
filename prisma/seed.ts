// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed products
  const products = [
    {
      name: 'ZenPotion Original',
      slug: 'zenpotion-original',
      price: 49.0,
      description: 'Our signature coconut water blend with lemon, mint & tulsi.',
      imageUrl: '/bottle.png',
      inStock: false,
    },
    {
      name: 'ZenPotion Citrus Burst',
      slug: 'zenpotion-citrus-burst',
      price: 49.0,
      description: 'Extra lemon and ginger for a more intense citrus kick.',
      imageUrl: '/bottle.png',
      inStock: false,
    },
    {
      name: 'ZenPotion Mint Cool',
      slug: 'zenpotion-mint-cool',
      price: 49.0,
      description: 'Double mint and cucumber for the ultimate cooling refreshment.',
      imageUrl: '/bottle.png',
      inStock: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`✅ Seeded ${products.length} products`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
