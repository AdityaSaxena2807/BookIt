import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";

const router = Router();
const prisma = new PrismaClient();

// GET /api/experiences - Get all experiences
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    const where: any = {};

    if (category) {
      where.category = category as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { location: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const experiences = await prisma.experience.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// GET /api/experiences/:id - Get single experience with slots
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Group slots by date
    const slotsByDate: Record<string, any[]> = {};
    experience.slots.forEach((slot) => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push({
        ...slot,
        available: slot.capacity - slot.booked,
        isFull: slot.booked >= slot.capacity,
      });
    });

    res.json({
      ...experience,
      slotsByDate,
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience details' });
  }
});

export default router;