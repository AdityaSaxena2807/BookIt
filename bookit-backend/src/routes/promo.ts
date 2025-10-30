import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Validation schema
const validatePromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
  amount: z.number().positive('Amount must be positive'),
});

// POST /api/promo/validate - Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const validatedData = validatePromoSchema.parse(req.body);
    const { code, amount } = validatedData;

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return res.status(404).json({
        valid: false,
        error: 'Invalid promo code',
      });
    }

    if (!promo.isActive) {
      return res.status(400).json({
        valid: false,
        error: 'This promo code is no longer active',
      });
    }

    // Check if expired
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({
        valid: false,
        error: 'This promo code has expired',
      });
    }

    // Check minimum amount
    if (amount < promo.minAmount) {
      return res.status(400).json({
        valid: false,
        error: `Minimum booking amount of $${promo.minAmount} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === 'percentage') {
      discount = (amount * promo.value) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else if (promo.type === 'flat') {
      discount = promo.value;
    }

    const finalAmount = amount - discount;

    res.json({
      valid: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discount: Math.round(discount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      message:
        promo.type === 'percentage'
          ? `${promo.value}% off applied!`
          : `$${promo.value} discount applied!`,
    });
  } catch (error: any) {
    console.error('Error validating promo code:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        valid: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }

    res.status(500).json({
      valid: false,
      error: 'Failed to validate promo code',
    });
  }
});

export default router;