import { describe, expect, test } from "vitest";
import { api } from "./api";

describe("test GET-* package route", () => {
  test("should return types for a single package", async () => {
    const response = await api.fetch("/types/package/lodash@4.0.0");
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toMatchObject({
      package: "lodash",
      version: "4.0.0",
      files: expect.any(Object),
    });
  });

  test("should handle scoped packages", async () => {
    const response = await api.fetch("/types/package/@types/node@18.0.0");
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toMatchObject({
      package: "@types/node",
      version: "18.0.0",
      files: expect.any(Object),
    });
  });
});

describe("test GET group route", () => {
  test("should return types for multiple packages", async () => {
    const response = await api.fetch("/types/group?packages=lodash@4.0.0,got@11.0.0");
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);

    expect(data[0]).toMatchObject({
      package: expect.any(String),
      version: expect.any(String),
      files: expect.any(Object),
    });
  });

  test("should handle empty results gracefully", async () => {
    const response = await api.fetch("/types/group?packages=non-existent-package@1.0.0");
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });
});
