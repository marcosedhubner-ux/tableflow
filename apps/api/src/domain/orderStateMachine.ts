import type { OrderStatus } from "@prisma/client";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["SERVED", "CANCELLED"],
  SERVED: ["PAID"],
  PAID: [],
  CANCELLED: [],
};

export function canTransition(current: OrderStatus, next: OrderStatus): boolean {
  return allowedTransitions[current].includes(next);
}

export function assertValidTransition(current: OrderStatus, next: OrderStatus): void {
  if (!canTransition(current, next)) {
    throw new InvalidOrderTransitionError(current, next);
  }
}

export class InvalidOrderTransitionError extends Error {
  constructor(current: OrderStatus, attempted: OrderStatus) {
    super(`Cannot move order from ${current} to ${attempted}`);
    this.name = "InvalidOrderTransitionError";
  }
}
