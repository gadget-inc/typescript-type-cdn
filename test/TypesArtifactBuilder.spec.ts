import type { Client } from "@gadget-client/typescript-type-cdn";
import { describe, expect, it } from "vitest";
import { TypesArtifactBuilder } from "../api/services/TypesArtifactBuilder";

// Mock minimal Gadget client for testing
const mockGadgetClient = {
  internal: {
    cache: {
      findMany: async () => [] as any[],
      create: async () => ({ id: "1" }),
    },
  },
} as unknown as Client;

describe("TypesArtifactBuilder", () => {
  it("should fetch and parse types from a simple package", async () => {
    const builder = new TypesArtifactBuilder("is-even", "1.0.0");
    const result = await builder.getTypes(mockGadgetClient);

    expect(result.package).toBe("is-even");
    expect(result.version).toBe("1.0.0");
    expect(result.files).toBeTypeOf("object");
    expect(Object.keys(result.files)).toContain("package.json");
  }, 30000);

  it("should handle scoped packages", async () => {
    const builder = new TypesArtifactBuilder("@types/node", "18.0.0");
    const result = await builder.getTypes(mockGadgetClient);

    expect(result.package).toBe("@types/node");
    expect(result.version).toBe("18.0.0");
    expect(result.files).toBeTypeOf("object");
    expect(Object.keys(result.files).some((file) => file.endsWith(".d.ts"))).toBe(true);
  }, 30000);

  it("should extract .d.ts files from a package", async () => {
    const builder = new TypesArtifactBuilder("typescript", "5.0.4");
    const result = await builder.buildTypes();

    // Should find some .d.ts files
    const dtsFiles = Object.keys(result).filter((file) => file.endsWith(".d.ts"));
    expect(dtsFiles.length).toBeGreaterThan(0);
  }, 30000);

  it("should handle packages that need all TS files", async () => {
    const builder = new TypesArtifactBuilder("@shopify/app-bridge-types", "0.0.1");
    const result = await builder.buildTypes();

    // Should find both .ts and .d.ts files
    const tsFiles = Object.keys(result).filter((file) => file.endsWith(".ts"));
    expect(tsFiles.length).toBeGreaterThan(0);
  }, 30000);

  it("should handle package.json files", async () => {
    const builder = new TypesArtifactBuilder("lodash", "4.17.21");
    const result = await builder.buildTypes();

    expect(result["package.json"]).toBeDefined();
    expect(() => JSON.parse(result["package.json"])).not.toThrow();
  }, 30000);

  it("should handle other JSON files as empty objects", async () => {
    const builder = new TypesArtifactBuilder("@types/react", "18.0.28");
    const result = await builder.buildTypes();

    const jsonFiles = Object.entries(result).filter(([file]) => file.endsWith(".json") && file !== "package.json");

    jsonFiles.forEach(([_, content]) => {
      expect(content).toBe("{}");
    });
  }, 30000);

  it("should preserve nested package.json files", async () => {
    const builder = new TypesArtifactBuilder("@gadgetinc/react", "0.18.2");
    const result = await builder.buildTypes();

    const nestedPackageJson = result["auto/polaris/package.json"];
    expect(nestedPackageJson).toBeDefined();
    expect(() => JSON.parse(nestedPackageJson)).not.toThrow();
    expect(nestedPackageJson).toMatchInlineSnapshot(`
      "{"main": "../../dist/cjs/auto/polaris/index.js"}
      "
    `);
  }, 30000);

  it("should throw on invalid package versions", async () => {
    const builder = new TypesArtifactBuilder("react", "not-a-version");
    await expect(builder.buildTypes()).rejects.toThrow();
  }, 30000);

  it("should cache results", async () => {
    const cachedResults = { someTypes: "cached" };
    const clientWithCache = {
      internal: {
        cache: {
          findMany: async () => [
            {
              serializedTypes: JSON.stringify(cachedResults),
            },
          ],
          create: async () => ({ id: "1" }),
        },
      },
    } as unknown as Client;

    const builder = new TypesArtifactBuilder("tiny-package", "1.0.0");
    const result = await builder.getTypes(clientWithCache);

    expect(result.files).toEqual(cachedResults);
  }, 30000);
});
