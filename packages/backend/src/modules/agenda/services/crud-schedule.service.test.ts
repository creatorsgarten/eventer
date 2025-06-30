import { describe, it, expect } from "vitest";
import { db } from "#backend/infrastructure/db";

describe("agenda", () => {
  it("should have the correct schema", () => {
    const agenda = db.query.agenda;
    expect(agenda).toBeDefined();
  });
});
