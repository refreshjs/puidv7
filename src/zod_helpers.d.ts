import { z } from "zod";
export declare function puidv7zod(
  prefix: string,
  base?: z.ZodType<any>,
): z.ZodEffects<z.ZodString, string, string>;
