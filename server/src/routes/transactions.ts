import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createTransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.string().min(1),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().datetime().optional()
});

const updateTransactionSchema = createTransactionSchema.partial();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Get all transactions
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { page = '1', limit = '50', category, type, startDate, endDate } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { userId: req.userId };

    if (category) where.category = category;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' }
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create transaction
router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createTransactionSchema.parse(req.body);
    
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        userId: req.userId!
      }
    });

    res.status(201).json({ transaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transaction by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = updateTransactionSchema.parse(req.body);
    
    const transaction = await prisma.transaction.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId!
      },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      }
    });

    if (transaction.count === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updatedTransaction = await prisma.transaction.findUnique({
      where: { id: req.params.id }
    });

    res.json({ transaction: updatedTransaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete transaction
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const result = await prisma.transaction.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;