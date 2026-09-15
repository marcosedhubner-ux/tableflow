import { prisma } from "../../db/client.js";
import { NotFoundError } from "../../domain/errors.js";
import type { CreateMenuItemInput, UpdateMenuItemInput } from "./menu.schema.js";

export function listMenuItems() {
  return prisma.menuItem.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
}

export function createMenuItem(input: CreateMenuItemInput) {
  return prisma.menuItem.create({ data: input });
}

export async function updateMenuItem(id: string, input: UpdateMenuItemInput) {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) {
    throw new NotFoundError("Menu item");
  }

  return prisma.menuItem.update({ where: { id }, data: input });
}
