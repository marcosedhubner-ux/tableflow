import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!123", 12);

  const manager = await prisma.staff.upsert({
    where: { email: "manager@tableflow.dev" },
    update: {},
    create: {
      fullName: "Alexandra Reyes",
      email: "manager@tableflow.dev",
      passwordHash,
      role: "MANAGER",
    },
  });

  await prisma.staff.upsert({
    where: { email: "server@tableflow.dev" },
    update: {},
    create: {
      fullName: "Diego Fontes",
      email: "server@tableflow.dev",
      passwordHash,
      role: "SERVER",
    },
  });

  await prisma.staff.upsert({
    where: { email: "kitchen@tableflow.dev" },
    update: {},
    create: {
      fullName: "Priya Nair",
      email: "kitchen@tableflow.dev",
      passwordHash,
      role: "KITCHEN",
    },
  });

  const tableSeeds = [
    { tableNumber: 1, tableType: "STANDARD" as const, seatCount: 2 },
    { tableNumber: 2, tableType: "STANDARD" as const, seatCount: 4 },
    { tableNumber: 3, tableType: "BOOTH" as const, seatCount: 6 },
    { tableNumber: 4, tableType: "BAR" as const, seatCount: 2 },
    { tableNumber: 5, tableType: "OUTDOOR" as const, seatCount: 4 },
    { tableNumber: 6, tableType: "OUTDOOR" as const, seatCount: 8 },
  ];

  for (const table of tableSeeds) {
    await prisma.restaurantTable.upsert({
      where: { tableNumber: table.tableNumber },
      update: {},
      create: table,
    });
  }

  const menuSeeds = [
    { name: "Grilled Salmon", category: "Main", unitPrice: 24.5 },
    { name: "Margherita Pizza", category: "Main", unitPrice: 16.0 },
    { name: "Caesar Salad", category: "Starter", unitPrice: 11.0 },
    { name: "Truffle Fries", category: "Starter", unitPrice: 8.5 },
    { name: "Tiramisu", category: "Dessert", unitPrice: 7.5 },
    { name: "Sparkling Water", category: "Beverage", unitPrice: 3.0 },
    { name: "House Red Wine", category: "Beverage", unitPrice: 9.0 },
  ];

  for (const item of menuSeeds) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }

  console.log(`Seed complete. Manager login: ${manager.email} / Passw0rd!123`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
