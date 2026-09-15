import { Prisma } from "@prisma/client";
import { prisma } from "../../db/client.js";
import * as ordersRepository from "./orders.repository.js";
import { NotFoundError, ConflictError } from "../../domain/errors.js";
import { assertValidTransition } from "../../domain/orderStateMachine.js";
import type { CreateOrderInput, UpdateOrderStatusInput } from "./orders.schema.js";

export async function createOrder(input: CreateOrderInput, serverId: string) {
  const table = await prisma.restaurantTable.findUnique({ where: { id: input.tableId } });
  if (!table) {
    throw new NotFoundError("Table");
  }

  const menuItemIds = input.items.map((item) => item.menuItemId);
  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: menuItemIds } } });

  if (menuItems.length !== new Set(menuItemIds).size) {
    throw new NotFoundError("One or more menu items");
  }

  const unavailableItem = menuItems.find((item) => !item.isAvailable);
  if (unavailableItem) {
    throw new ConflictError(`${unavailableItem.name} is currently unavailable`);
  }

  const priceByMenuItemId = new Map(menuItems.map((item) => [item.id, item.unitPrice]));
  const totalValue = input.items.reduce((sum, item) => {
    const unitPrice = priceByMenuItemId.get(item.menuItemId) as Prisma.Decimal;
    return sum.plus(unitPrice.times(item.quantity));
  }, new Prisma.Decimal(0));

  const [createdOrder] = await prisma.$transaction([
    prisma.order.create({
      data: {
        tableId: input.tableId,
        serverId,
        totalValue,
        items: {
          create: input.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes ?? null,
            unitPrice: priceByMenuItemId.get(item.menuItemId) as Prisma.Decimal,
          })),
        },
      },
    }),
    prisma.restaurantTable.update({ where: { id: input.tableId }, data: { status: "OCCUPIED" } }),
  ]);

  const order = await ordersRepository.findOrderById(createdOrder.id);
  return order as NonNullable<typeof order>;
}

export async function updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
  const order = await ordersRepository.findOrderById(orderId);
  if (!order) {
    throw new NotFoundError("Order");
  }

  assertValidTransition(order.status, input.status);

  const isClosingStatus = input.status === "PAID";
  const updatedOrder = await ordersRepository.updateOrderStatus(
    orderId,
    input.status,
    isClosingStatus ? new Date() : undefined
  );

  let updatedTable = null;
  if (input.status === "PAID") {
    updatedTable = await prisma.restaurantTable.update({
      where: { id: order.tableId },
      data: { status: "CLEANING" },
    });
  } else if (input.status === "CANCELLED") {
    updatedTable = await prisma.restaurantTable.update({
      where: { id: order.tableId },
      data: { status: "AVAILABLE" },
    });
  }

  return { order: updatedOrder, table: updatedTable };
}

export async function updateOrderItemReady(orderItemId: string, isReady: boolean) {
  const existing = await ordersRepository.getOrderItemWithOrder(orderItemId);
  if (!existing) {
    throw new NotFoundError("Order item");
  }

  await ordersRepository.updateOrderItemReady(orderItemId, isReady);
  const order = await ordersRepository.findOrderById(existing.orderId);
  if (!order) {
    throw new NotFoundError("Order");
  }

  const allItemsReady = order.items.every((item) => item.isReady);
  if (allItemsReady && order.status === "PREPARING") {
    return ordersRepository.updateOrderStatus(order.id, "READY");
  }

  return order;
}

export function listActiveOrders() {
  return ordersRepository.findActiveOrders();
}
