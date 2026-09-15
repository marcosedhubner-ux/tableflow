import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { tablesRouter } from "./modules/tables/tables.routes.js";
import { menuRouter } from "./modules/menu/menu.routes.js";
import { ordersRouter } from "./modules/orders/orders.routes.js";
import { analyticsRouter } from "./modules/analytics/analytics.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { apiRateLimiter } from "./middlewares/rateLimiters.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(apiRateLimiter);

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/auth", authRouter);
  app.use("/tables", tablesRouter);
  app.use("/menu", menuRouter);
  app.use("/orders", ordersRouter);
  app.use("/analytics", analyticsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
