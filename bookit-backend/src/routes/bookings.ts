import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Request, Response } from "express";

const router = Router();
const prisma = new PrismaClient();

// Validation schema
const bookingSchema = z.object({
  experienceId: z.string().uuid(),
  slotId: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  guests: z.number().int().min(1).max(10),
  promoCode: z.string().optional(),
});

// POST /api/bookings - Create a new booking
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = bookingSchema.parse(req.body);
    const { experienceId, slotId, name, email, phone, guests, promoCode } = validatedData;

    // Check if experience exists
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Check if slot exists and has availability
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    // Check availability
    const availableSpots = slot.capacity - slot.booked;
    if (availableSpots < guests) {
      return res.status(400).json({
        error: `Not enough availability. Only ${availableSpots} spots remaining.`,
      });
    }

    // Calculate price
    let totalPrice = slot.price * guests;
    let discount = 0;

    // Apply promo code if provided
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      });

      if (promo && promo.isActive) {
        // Check if expired
        if (promo.expiresAt && promo.expiresAt < new Date()) {
          return res.status(400).json({ error: 'Promo code has expired' });
        }

        // Check minimum amount
        if (totalPrice < promo.minAmount) {
          return res.status(400).json({
            error: `Minimum booking amount of $${promo.minAmount} required for this promo code`,
          });
        }

        // Calculate discount
        if (promo.type === 'percentage') {
          discount = (totalPrice * promo.value) / 100;
          if (promo.maxDiscount && discount > promo.maxDiscount) {
            discount = promo.maxDiscount;
          }
        } else if (promo.type === 'flat') {
          discount = promo.value;
        }

        totalPrice -= discount;
      } else if (promoCode) {
        return res.status(400).json({ error: 'Invalid promo code' });
      }
    }

    // Create booking and update slot in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Update slot booked count
      await tx.slot.update({
        where: { id: slotId },
        data: {
          booked: {
            increment: guests,
          },
        },
      });

      // Create booking
      return tx.booking.create({
        data: {
          experienceId,
          slotId,
          name,
          email,
          phone,
          guests,
          totalPrice,
          promoCode: promoCode?.toUpperCase(),
          discount,
          status: 'confirmed',
        },
        include: {
          experience: true,
          slot: true,
        },
      });
    });

    res.status(201).json({
      success: true,
      booking: {
        id: booking.id,
        experienceTitle: booking.experience.title,
        date: booking.slot.date,
        time: `${booking.slot.startTime} - ${booking.slot.endTime}`,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        discount: booking.discount,
        status: booking.status,
        name: booking.name,
        email: booking.email,
      },
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }

    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings/:id - Get booking details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        experience: true,
        slot: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      id: booking.id,
      experienceTitle: booking.experience.title,
      experienceImage: booking.experience.image,
      location: booking.experience.location,
      date: booking.slot.date,
      time: `${booking.slot.startTime} - ${booking.slot.endTime}`,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      discount: booking.discount,
      promoCode: booking.promoCode,
      status: booking.status,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      createdAt: booking.createdAt,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

export default router;