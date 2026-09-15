import { z } from "zod";

export const createOrderSchema = z.object({
  tableId: z.string().cuid(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().cuid(),
        quantity: z.number().int().min(1).max(50),
        notes: z.string().max(280).optional(),
      })
    )
    .min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PREPARING", "READY", "SERVED", "PAID", "CANCELLED"]),
});

export const updateOrderItemSchema = z.object({
  isReady: z.boolean(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
