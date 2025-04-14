// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, test } from "vitest";
import { modelsToPrefixes } from "./prefixer";

describe("modelsToPrefixes", () => {
  test("generates valid prefixes for unique lowercase models", () => {
    const models = ["account", "invoice", "invite", "session"];
    const result = modelsToPrefixes(models);
    console.log(JSON.stringify(result, null, 2));
    expect(Object.keys(result).length).toBe(4);
    expect(result).toHaveProperty("acc");
    expect(result).toHaveProperty("inv");
    expect(result).toHaveProperty("ivt");
    expect(result).toHaveProperty("ssn");
    expect(result["acc"]).toBe("account");
    expect(result["inv"]).toBe("invoice");
    expect(result["ivt"]).toBe("invite");
    expect(result["ssn"]).toBe("session");
  });

  test("throws error for duplicate model names", () => {
    const models = ["user", "post", "user"];
    expect(() => modelsToPrefixes(models)).toThrow(
      "Duplicate model names found: user",
    );
  });

  test("throws error for invalid model names", () => {
    const models = ["User", "post123", "comment-test"];
    expect(() => modelsToPrefixes(models)).toThrow(
      "Invalid model names found: User, post123, comment-test",
    );
  });

  test("handles empty array input", () => {
    const result = modelsToPrefixes([]);
    expect(result).toEqual({});
  });

  test("handles single model input", () => {
    const result = modelsToPrefixes(["task"]);
    expect(result).toEqual({ tsk: "task" });
  });

  test("throws error for models exceeding length limit", () => {
    const longModel = "a".repeat(101);
    expect(() => modelsToPrefixes([longModel])).toThrow(
      `Invalid model names found: ${longModel}`,
    );
  });
});
