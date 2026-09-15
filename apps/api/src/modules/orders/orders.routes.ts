import { Router } from "express";
import {
  createOrderSchema,
  updateOrderItemSchema,
  updateOrderStatusSchema,
} from "./orders.schema.js";
import * as ordersService from "./orders.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { broadcast } from "../../realtime/socket.js";
import { UnauthorizedError } from "../../domain/errors.js";

export const ordersRouter = Router();

ordersRouter.use(authenticate);

ordersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const orders = await ordersService.listActiveOrders();
    res.status(200).json({ orders });
  })
);

ordersRouter.post(
  "/",
  requireRole("SERVER", "MANAGER"),
  asyncHandler(async (req, res) => {
    if (!req.auth) throw new UnauthorizedError();
    const input = createOrderSchema.parse(req.body);
    const order = await ordersService.createOrder(input, req.auth.staffId);
    broadcast("order:created", order);
    broadcast("table:updated", order.table);
    res.status(201).json({ order });
  })
);

ordersRouter.patch(
  "/:id/status",
  requireRole("SERVER", "KITCHEN", "MANAGER"),
  asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const input = updateOrderStatusSchema.parse(req.body);
    const { order, table } = await ordersService.updateOrderStatus(id, input);
    broadcast("order:updated", order);
    if (table) broadcast("table:updated", table);
    res.status(200).json({ order });
  })
);

ordersRouter.patch(
  "/items/:itemId",
  requireRole("KITCHEN", "MANAGER"),
  asyncHandler(async (req, res) => {
    const { itemId } = req.params as { itemId: string };
    const input = updateOrderItemSchema.parse(req.body);
    const order = await ordersService.updateOrderItemReady(itemId, input.isReady);
    broadcast("order:updated", order);
    res.status(200).json({ order });
  })
);
