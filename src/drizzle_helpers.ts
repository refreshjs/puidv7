// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

import { customType } from "drizzle-orm/pg-core";
import { validatePrefix, decodeId, encodeId } from "./index";

// puidv7type generates a new drizzle type for a given prefix
export function puidv7drizzle(prefix: string) {
  validatePrefix(prefix);
  return customType<{
    data: string;
    driverData: string;
    notNull: true;
  }>({
    dataType() {
      return "uuid";
    },
    // toDriver decodes the puidv7 to a UUID
    toDriver(value: string) {
      return decodeId(value, prefix);
    },
    // fromDriver encodes the UUID to a puidv7
    fromDriver(value: string) {
      return encodeId(value, prefix);
    },
  });
}
