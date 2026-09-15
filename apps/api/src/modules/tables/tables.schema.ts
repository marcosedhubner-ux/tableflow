import { z } from "zod";

export const createTableSchema = z.object({
  tableNumber: z.number().int().positive(),
  tableType: z.enum(["STANDARD", "BOOTH", "OUTDOOR", "BAR"]),
  seatCount: z.number().int().min(1).max(20),
});

export const updateTableStatusSchema = z.object({
  status: z.enum(["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"]),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>;
