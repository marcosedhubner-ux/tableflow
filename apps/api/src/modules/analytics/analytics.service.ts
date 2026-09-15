import { prisma } from "../../db/client.js";

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function getDailySummary() {
  const since = startOfToday();

  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID", closedAt: { gte: since } },
    include: { items: { include: { menuItem: true } } },
  });

  const revenueToday = paidOrders.reduce((sum, order) => sum + Number(order.totalValue), 0);
  const ordersServedToday = paidOrders.length;

  const itemCounts = new Map<string, { name: string; quantity: number }>();
  for (const order of paidOrders) {
    for (const item of order.items) {
      const existing = itemCounts.get(item.menuItemId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        itemCounts.set(item.menuItemId, { name: item.menuItem.name, quantity: item.quantity });
      }
    }
  }

  const topMenuItems = Array.from(itemCounts.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const turnoverTimesMs = paidOrders
    .filter((order) => order.closedAt)
    .map((order) => (order.closedAt as Date).getTime() - order.createdAt.getTime());

  const averageTurnoverMinutes =
    turnoverTimesMs.length > 0
      ? Math.round(turnoverTimesMs.reduce((a, b) => a + b, 0) / turnoverTimesMs.length / 60000)
      : 0;

  return { revenueToday, ordersServedToday, topMenuItems, averageTurnoverMinutes };
}
