// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

import { base32crockford } from "@scure/base";
import { uuidv7 } from "uuidv7";

/**
 * Validate prefix returns a validated prefix with hypen or empty string,
 * or throws an error if the prefix is invalid.
 * @param prefix The prefix to validate
 * @returns The validated prefix
 */
export function validatePrefix(prefix: string) {
  if (prefix && !/^[a-z]{3}$/.test(prefix)) {
    throw new Error(
      "puidv7 prefix must be 3 lowercase a-z characters. got: " + prefix,
    );
  }
}

/**
 * Encodes a UUID to a lowercased, url-safe, prefixed base32 representation.
 * First it validates the UUID string.
 * Then it converts the UUID to lowercase, removes the hypens.
 * Then it encodes the string using Crockford base32 and prefixes it.
 * @param uuid The UUID string to encode
 * @param prefix The 3 (a-z) character prefix
 * @throws Error if the UUID is not a valid UUID string
 * @returns prefixed base32-encoded string
 */
export function encodeId(uuid: string, prefix: string): string {
  validatePrefix(prefix);
  // validate UUID
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    )
  ) {
    throw new Error("invalid UUID provided to encodeId");
  }
  // remove hyphes and convert to lowercase
  uuid = uuid.toLowerCase().replaceAll("-", "");
  // conver the hex string UUID to Uint8Array, then crockford base32 encode it
  const buf = Uint8Array.from(uuid.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const encoded = base32crockford.encode(buf).toLowerCase();
  return `${prefix ?? ""}${encoded}`;
}

/**
 * validateId validates a lowercased, url-safe, prefixed crockford base32 ID,
 * including checking the prefix is valid
 */
export function validateId(id: string, prefix: string) {
  validatePrefix(prefix);
  id = id.toLowerCase();
  // validate the id characters
  if (!/^[a-z]{3}[0-9a-z]{26}$/.test(id)) {
    throw new Error("puidv7 invalid - cannot decode: " + id);
  }
  // validate the id prefix
  if (prefix && !id.startsWith(prefix)) {
    throw new Error("puidv7 prefix mismatch - cannot decode");
  }
}

/**
 * Decodes a lowercased, url-safe, prefixed crockford base32 ID back to a
 * UUID string, including hyphens.
 * @param id The ID
 * @param prefix The expected 3 (a-z) character prefix
 * @throws Error if the prefix does not match or the ID is invalid
 * @throws Error if the ID is not a valid base32-encoded UUID
 * @throws Error if the ID is not a valid UUIDv7 string
 * @returns UUIDv7 string with hyphens
 */
export function decodeId(id: string, prefix: string): string {
  validateId(id, prefix);
  // Convert crockford base32 to UUIDv7 with hypens
  const prefixlessId = id.substring(prefix.length);
  const b32 = base32crockford.decode(prefixlessId);
  const hex = Array.from(b32)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const uuid = hex.replace(
    /([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/i,
    "$1-$2-$3-$4-$5",
  );
  // check uuid is valid
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid,
    )
  ) {
    throw new Error("puidv7 ID is not a valid UUID");
  }
  return uuid;
}

/**
 * Generates a new UUIDv7 and encodes it to a lowercased, url-safe, prefixed
 * base32 representation.
 * @param prefix The 3 (a-z) character prefix
 * @returns prefixed base32-encoded string
 */
export function newId(prefix: string): string {
  return encodeId(uuidv7(), prefix);
}
