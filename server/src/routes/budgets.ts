import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const budgetCategorySchema = z.object({
  category: z.string().min(1),
  budgetedAmount: z.number().positive(),
  alertThreshold: z.number().min(0).max(1).default(0.8)
});

const createBudgetSchema = z.object({
  name: z.string().min(1),
  month: z.string().datetime(),
  totalLimit: z.number().positive(),
  rolloverEnabled: z.boolean().default(false),
  categories: z.array(budgetCategorySchema)
});

// Apply auth middleware
router.use(authenticateToken);

// Get all budgets
router.get('/', async (req: AuthRequest, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId! },
      include: {
        categories: true
      },
      orderBy: { month: 'desc' }
    });

    res.json({ budgets });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create budget
router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createBudgetSchema.parse(req.body);
    
    const budget = await prisma.budget.create({
      data: {
        name: data.name,
        month: new Date(data.month),
        totalLimit: data.totalLimit,
        rolloverEnabled: data.rolloverEnabled,
        userId: req.userId!,
        categories: {
          create: data.categories
        }
      },
      include: {
        categories: true
      }
    });

    res.status(201).json({ budget });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get budget by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const budget = await prisma.budget.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      },
      include: {
        categories: true
      }
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ budget });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current month budget
router.get('/current/month', async (req: AuthRequest, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const budget = await prisma.budget.findFirst({
      where: {
        userId: req.userId!,
        month: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        categories: true
      }
    });

    if (!budget) {
      return res.status(404).json({ error: 'No budget found for current month' });
    }

    // Calculate actual spending for each category
    const categoriesWithSpending = await Promise.all(
      budget.categories.map(async (category) => {
        const totalSpent = await prisma.transaction.aggregate({
          where: {
            userId: req.userId!,
            category: category.category,
            type: 'EXPENSE',
            date: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          },
          _sum: {
            amount: true
          }
        });

        return {
          ...category,
          spentAmount: totalSpent._sum.amount || 0
        };
      })
    );

    res.json({
      budget: {
        ...budget,
        categories: categoriesWithSpending
      }
    });
  } catch (error) {
    console.error('Get current budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;