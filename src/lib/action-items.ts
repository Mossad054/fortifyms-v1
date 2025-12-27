
import { z } from 'zod';

export const UpdateActionItemRequestSchema = z.object({
    status: z.string().optional(),
    priority: z.string().optional(),
    assignee: z.string().optional(),
    dueDate: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional()
});
