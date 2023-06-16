import { describe, expect, test } from "vitest";
import checkNpmNameExists from "../src";

describe("checkNpmNameExists", () => {
  test("should return true if package exists", async () => {
    const exists = await checkNpmNameExists("lodash");
    expect(exists).toBe(true);
  });

  test("should return false if package does not exist", async () => {
    const exists = await checkNpmNameExists(`nonexistent-package${new Date().getMilliseconds()}`);
    expect(exists).toBe(false);
  });

  test("should return true if scoped package exists", async () => {
    const exists = await checkNpmNameExists("@babel/core");
    expect(exists).toBe(true);
  });

  test("should return false if scoped package does not exist", async () => {
    const exists = await checkNpmNameExists("@nonexistent-scope/nonexistent-package");
    expect(exists).toBe(false);
  });

  test("should return true if organization exists", async () => {
    const exists = await checkNpmNameExists("@vercel");
    expect(exists).toBe(true);
  });

  test("should return false if organization does not exist", async () => {
    const exists = await checkNpmNameExists("@nonexistent-organization");
    expect(exists).toBe(false);
  });

  test("should throw error if package name is not provided", async () => {
    await expect(checkNpmNameExists("")).rejects.toThrow("Package name required");
  });

  test("should throw error if registryUrl is not a valid string URL", async () => {
    const invalidUrl = "invalid-url";
    await expect(checkNpmNameExists("package", { registryUrl: invalidUrl })).rejects.toThrow("The `registryUrl` option must be a valid string URL");
  });
});
