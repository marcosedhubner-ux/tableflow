import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.string().min(2).max(60),
  unitPrice: z.number().positive().max(10000),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  category: z.string().min(2).max(60).optional(),
  unitPrice: z.number().positive().max(10000).optional(),
  isAvailable: z.boolean().optional(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
