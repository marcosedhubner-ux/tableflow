import { prisma } from "../../db/client.js";
import type { OrderStatus, Prisma } from "@prisma/client";

const orderInclude = {
  items: { include: { menuItem: true } },
  table: true,
  server: { select: { id: true, fullName: true } },
} satisfies Prisma.OrderInclude;

export function findOrderById(id: string) {
  return prisma.order.findUnique({ where: { id }, include: orderInclude });
}

export function findActiveOrders() {
  return prisma.order.findMany({
    where: { status: { notIn: ["PAID", "CANCELLED"] } },
    include: orderInclude,
    orderBy: { createdAt: "asc" },
  });
}

export function updateOrderStatus(id: string, status: OrderStatus, closedAt?: Date) {
  return prisma.order.update({
    where: { id },
    data: { status, ...(closedAt ? { closedAt } : {}) },
    include: orderInclude,
  });
}

export function updateOrderItemReady(orderItemId: string, isReady: boolean) {
  return prisma.orderItem.update({ where: { id: orderItemId }, data: { isReady } });
}

export function getOrderItemWithOrder(orderItemId: string) {
  return prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: { include: orderInclude } },
  });
}

export const orderIncludeShape = orderInclude;
