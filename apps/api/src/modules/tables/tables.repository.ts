import { prisma } from "../../db/client.js";
import type { CreateTableInput } from "./tables.schema.js";
import type { TableStatus } from "@prisma/client";

export function findAllTables() {
  return prisma.restaurantTable.findMany({
    orderBy: { tableNumber: "asc" },
    include: {
      orders: {
        where: { status: { notIn: ["PAID", "CANCELLED"] } },
        include: { items: { include: { menuItem: true } } },
      },
    },
  });
}

export function findTableById(id: string) {
  return prisma.restaurantTable.findUnique({ where: { id } });
}

export function createTable(input: CreateTableInput) {
  return prisma.restaurantTable.create({ data: input });
}

export function updateTableStatus(id: string, status: TableStatus) {
  return prisma.restaurantTable.update({ where: { id }, data: { status } });
}
