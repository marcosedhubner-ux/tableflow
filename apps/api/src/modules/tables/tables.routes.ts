import { Router } from "express";
import { createTableSchema, updateTableStatusSchema } from "./tables.schema.js";
import * as tablesService from "./tables.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { broadcast } from "../../realtime/socket.js";

export const tablesRouter = Router();

tablesRouter.use(authenticate);

tablesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const tables = await tablesService.listTables();
    res.status(200).json({ tables });
  })
);

tablesRouter.post(
  "/",
  requireRole("MANAGER"),
  asyncHandler(async (req, res) => {
    const input = createTableSchema.parse(req.body);
    const table = await tablesService.createTable(input);
    broadcast("table:created", table);
    res.status(201).json({ table });
  })
);

tablesRouter.patch(
  "/:id/status",
  requireRole("SERVER", "MANAGER"),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const input = updateTableStatusSchema.parse(req.body);
    const table = await tablesService.updateTableStatus(id, input);
    broadcast("table:updated", table);
    res.status(200).json({ table });
  })
);
