import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  targetAmount: z.number().positive(),
  targetDate: z.string().datetime().optional()
});

const updateGoalSchema = createGoalSchema.partial().extend({
  currentAmount: z.number().min(0).optional(),
  isCompleted: z.boolean().optional()
});

// Apply auth middleware
router.use(authenticateToken);

// Get all goals
router.get('/', async (req: AuthRequest, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create goal
router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createGoalSchema.parse(req.body);
    
    const goal = await prisma.goal.create({
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        userId: req.userId!
      }
    });

    res.status(201).json({ goal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update goal
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const data = updateGoalSchema.parse(req.body);
    
    const goal = await prisma.goal.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId!
      },
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined
      }
    });

    if (goal.count === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const updatedGoal = await prisma.goal.findUnique({
      where: { id: req.params.id }
    });

    res.json({ goal: updatedGoal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;