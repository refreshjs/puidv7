// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

import { describe, test, expect } from "vitest";
import { newId, encodeId, decodeId } from "./index";

describe("newId", () => {
  test("generates unique IDs", async () => {
    const id1 = newId("acc");
    const id2 = newId("acc");
    expect(id1.length).toBe(29);
    expect(id2.length).toBe(29);
    expect(id1).not.toBe(id2);
  });
});

const staticUuidv7 = "01960ec0-c6cf-74d3-ae14-50c20e035fe6"; // 36 chars
const staticUUidv7b32c = "06b0xg66sxtd7bgma310w0tzwr"; // 26 chars

describe("encodeId", () => {
  test("generates an ID with the correct prefix", () => {
    const result = encodeId(staticUuidv7, "tst");
    expect(result).toBe("tst" + staticUUidv7b32c);
  });

  test("throws for invalid prefixes", () => {
    expect(() => encodeId(staticUuidv7, "invalidPrefix123")).toThrow();
    expect(() => encodeId(staticUuidv7, "invalidPrefix!")).toThrow();
    expect(() => encodeId(staticUuidv7, "UPPER")).toThrow();
  });

  test("maintains consistent format", () => {
    const result = encodeId(staticUuidv7, "acc");
    expect(result.substring(0, 3)).toBe("acc");
    expect(result.substring(3)).toBe(staticUUidv7b32c);
  });
});

describe("decodeId", () => {
  test("should decode a valid prefixed UUIDv7", () => {
    const encoded = "tst" + staticUUidv7b32c;
    const result = decodeId(encoded, "tst");
    expect(result).toBe(staticUuidv7);
  });

  test("should throw for invalid prefixes", () => {
    expect(() => decodeId("tst" + staticUUidv7b32c, "invalidPrefix")).toThrow();
  });

  test("should throw for invalid UUIDv7 format", () => {
    expect(() => decodeId("tstinvalid", "tst")).toThrow();
  });
});
