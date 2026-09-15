import { Prisma } from "@prisma/client";
import * as tablesRepository from "./tables.repository.js";
import { ConflictError, NotFoundError } from "../../domain/errors.js";
import type { CreateTableInput, UpdateTableStatusInput } from "./tables.schema.js";

export function listTables() {
  return tablesRepository.findAllTables();
}

export async function createTable(input: CreateTableInput) {
  try {
    return await tablesRepository.createTable(input);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ConflictError(`Table number ${input.tableNumber} already exists`);
    }
    throw err;
  }
}

export async function updateTableStatus(id: string, input: UpdateTableStatusInput) {
  const table = await tablesRepository.findTableById(id);
  if (!table) {
    throw new NotFoundError("Table");
  }

  return tablesRepository.updateTableStatus(id, input.status);
}
