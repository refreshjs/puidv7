// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

import { validateId, validatePrefix } from "./index";
import { z } from "zod";

export function puidv7zod(prefix: string, base?: z.ZodType<any>) {
  validatePrefix(prefix);
  if (!base) {
    base = z.string();
  }
  return z.string().refine(
    (id: string) => {
      validateId(id, prefix);
      return true;
    },
    {
      message: "Invalid puidv7 ID",
    },
  );
}
