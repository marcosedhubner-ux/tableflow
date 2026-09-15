import { describe, expect, it } from "vitest";
import { canTransition, assertValidTransition, InvalidOrderTransitionError } from "../src/domain/orderStateMachine.js";

describe("orderStateMachine", () => {
  it("allows the standard happy path", () => {
    expect(canTransition("PENDING", "PREPARING")).toBe(true);
    expect(canTransition("PREPARING", "READY")).toBe(true);
    expect(canTransition("READY", "SERVED")).toBe(true);
    expect(canTransition("SERVED", "PAID")).toBe(true);
  });

  it("allows cancellation before the order is served", () => {
    expect(canTransition("PENDING", "CANCELLED")).toBe(true);
    expect(canTransition("PREPARING", "CANCELLED")).toBe(true);
    expect(canTransition("READY", "CANCELLED")).toBe(true);
  });

  it("rejects skipping states", () => {
    expect(canTransition("PENDING", "READY")).toBe(false);
    expect(canTransition("PENDING", "SERVED")).toBe(false);
    expect(canTransition("PREPARING", "PAID")).toBe(false);
  });

  it("rejects any transition out of a terminal state", () => {
    expect(canTransition("PAID", "PENDING")).toBe(false);
    expect(canTransition("CANCELLED", "PENDING")).toBe(false);
  });

  it("throws a descriptive error on an invalid transition", () => {
    expect(() => assertValidTransition("PAID", "PREPARING")).toThrow(InvalidOrderTransitionError);
  });
});
