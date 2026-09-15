import { Router } from "express";
import { getDailySummary } from "./analytics.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { requireRole } from "../../middlewares/requireRole.js";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate, requireRole("MANAGER"));

analyticsRouter.get(
  "/daily-summary",
  asyncHandler(async (_req, res) => {
    const summary = await getDailySummary();
    res.status(200).json(summary);
  })
);
