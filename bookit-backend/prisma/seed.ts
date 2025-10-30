import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.promoCode.deleteMany();

  // Create promo codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        minAmount: 100,
        isActive: true,
      },
      {
        code: 'FLAT100',
        type: 'flat',
        value: 100,
        minAmount: 500,
        isActive: true,
      },
      {
        code: 'WELCOME20',
        type: 'percentage',
        value: 20,
        minAmount: 200,
        maxDiscount: 500,
        isActive: true,
      },
    ],
  });

  // Create experiences with slots
  const experiences = [
    {
      title: 'Sunset Desert Safari',
      description:
        'Experience the magic of the Arabian desert at sunset. Enjoy dune bashing, camel riding, and a traditional BBQ dinner under the stars.',
      location: 'Dubai Desert Conservation Reserve',
      category: 'Adventure',
      price: 299,
      duration: '6 hours',
      image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
      rating: 4.8,
      reviewCount: 234,
      highlights: [
        'Professional 4x4 dune bashing',
        'Camel riding experience',
        'Traditional BBQ dinner',
        'Live entertainment',
        'Henna painting',
      ],
      included: [
        'Hotel pickup and drop-off',
        'Professional guide',
        'All activities',
        'Dinner and refreshments',
        'Safety equipment',
      ],
    },
    {
      title: 'Scuba Diving Adventure',
      description:
        'Dive into crystal clear waters and explore vibrant coral reefs teeming with marine life. Perfect for beginners and experienced divers.',
      location: 'Fujairah Coast',
      category: 'Water Sports',
      price: 450,
      duration: '4 hours',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      rating: 4.9,
      reviewCount: 189,
      highlights: [
        'PADI certified instructors',
        'All equipment provided',
        'Underwater photography',
        'Marine life spotting',
        'Beginner friendly',
      ],
      included: [
        'Full diving equipment',
        'Professional instructor',
        'Underwater photos',
        'Light refreshments',
        'Insurance coverage',
      ],
    },
    {
      title: 'Hot Air Balloon Ride',
      description:
        'Soar above the desert landscape at sunrise. Witness breathtaking views and spot wildlife from a unique perspective.',
      location: 'Al Ain Desert',
      category: 'Aerial',
      price: 899,
      duration: '4 hours',
      image: 'https://images.unsplash.com/photo-1498550744921-75f79806b163?w=800',
      rating: 5.0,
      reviewCount: 156,
      highlights: [
        'Sunrise flight experience',
        'Wildlife spotting',
        'Champagne breakfast',
        'Flight certificate',
        'Small group sizes',
      ],
      included: [
        'Hotel transfers',
        'Pre-flight refreshments',
        '1-hour balloon ride',
        'Gourmet breakfast',
        'Flight certificate',
      ],
    },
    {
      title: 'Mountain Hiking Expedition',
      description:
        'Trek through stunning mountain trails with experienced guides. Discover hidden wadis and enjoy panoramic views.',
      location: 'Hatta Mountains',
      category: 'Hiking',
      price: 199,
      duration: '5 hours',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      rating: 4.7,
      reviewCount: 298,
      highlights: [
        'Scenic mountain trails',
        'Hidden wadis exploration',
        'Professional mountain guide',
        'Photo opportunities',
        'All fitness levels',
      ],
      included: [
        'Expert guide',
        'Hiking equipment',
        'Water and snacks',
        'First aid kit',
        'Transportation',
      ],
    },
    {
      title: 'Luxury Yacht Cruise',
      description:
        'Sail along the stunning coastline on a private yacht. Enjoy swimming, snorkeling, and a delicious lunch onboard.',
      location: 'Dubai Marina',
      category: 'Water',
      price: 1299,
      duration: '8 hours',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800',
      rating: 4.9,
      reviewCount: 87,
      highlights: [
        'Private yacht charter',
        'Swimming and snorkeling',
        'Gourmet lunch',
        'Scenic coastline views',
        'Luxury amenities',
      ],
      included: [
        'Private yacht',
        'Professional crew',
        'Lunch and beverages',
        'Snorkeling equipment',
        'Towels and amenities',
      ],
    },
    {
      title: 'Cultural Heritage Tour',
      description:
        'Explore historic sites, traditional markets, and museums. Learn about rich cultural heritage with an expert guide.',
      location: 'Old Dubai',
      category: 'Cultural',
      price: 149,
      duration: '3 hours',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      rating: 4.6,
      reviewCount: 412,
      highlights: [
        'Historic Al Fahidi district',
        'Traditional souks',
        'Museum visits',
        'Expert historian guide',
        'Cultural insights',
      ],
      included: [
        'Expert guide',
        'All entrance fees',
        'Traditional refreshments',
        'Hotel pickup',
        'Small group tour',
      ],
    },
  ];

  for (const exp of experiences) {
    const experience = await prisma.experience.create({
      data: exp,
    });

    // Create slots for next 14 days
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + i);

      // Morning slot
      slots.push({
        experienceId: experience.id,
        date: slotDate,
        startTime: '08:00',
        endTime: '12:00',
        capacity: 10,
        booked: Math.floor(Math.random() * 3), // 0-2 booked
        price: experience.price,
      });

      // Afternoon slot
      slots.push({
        experienceId: experience.id,
        date: slotDate,
        startTime: '14:00',
        endTime: '18:00',
        capacity: 10,
        booked: Math.floor(Math.random() * 5), // 0-4 booked
        price: experience.price,
      });

      // Evening slot (for some experiences)
      if (['Adventure', 'Cultural', 'Water'].includes(experience.category)) {
        slots.push({
          experienceId: experience.id,
          date: slotDate,
          startTime: '18:00',
          endTime: '22:00',
          capacity: 8,
          booked: Math.floor(Math.random() * 4), // 0-3 booked
          price: experience.price * 1.2, // Evening premium
        });
      }
    }

    await prisma.slot.createMany({
      data: slots,
    });

    console.log(`✅ Created experience: ${experience.title} with ${slots.length} slots`);
  }

  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    // Avoid compile error for `process` by accessing it at runtime via globalThis.
    const p: any = (globalThis as any).process;
    if (p && typeof p.exit === 'function') {
      p.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });