import { Router } from "express";
import { createMenuItemSchema, updateMenuItemSchema } from "./menu.schema.js";
import * as menuService from "./menu.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";

export const menuRouter = Router();

menuRouter.use(authenticate);

menuRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const menuItems = await menuService.listMenuItems();
    res.status(200).json({ menuItems });
  })
);

menuRouter.post(
  "/",
  requireRole("MANAGER"),
  asyncHandler(async (req, res) => {
    const input = createMenuItemSchema.parse(req.body);
    const menuItem = await menuService.createMenuItem(input);
    res.status(201).json({ menuItem });
  })
);

menuRouter.patch(
  "/:id",
  requireRole("MANAGER"),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const input = updateMenuItemSchema.parse(req.body);
    const menuItem = await menuService.updateMenuItem(id, input);
    res.status(200).json({ menuItem });
  })
);
