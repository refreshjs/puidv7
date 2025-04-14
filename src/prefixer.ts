// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

// prefixingStrategies is an array of functions which generate a prefix string
// from the given lowercased-character array.
// it is used by the modelToPrefix function to iterate over the functions
// until a unique prefix is found.
// if a string is not returned, it is not checked and next function is used.
const prefixingStrategies: ((chars: string[]) => string | undefined)[] = [
  // option 1: if the model is 3 characters, return the model as-is
  (chars) => {
    if (chars.length === 3) {
      return chars.join("");
    }
    return;
  },
  // option 2: exclude vowels and triple-repeating chars
  // examples: session = ssn, mfa = mf, setup = stp
  (chars) => {
    const first = chars[0];
    const validChars = chars
      .slice(1)
      .filter((c) => {
        return !"aeiou".includes(c);
      })
      .filter((c, i) => {
        return c !== chars[i - 1];
      });
    if (validChars.length == 0) {
      return;
    } else if (validChars.length == 1) {
      return [first, validChars[0], validChars[0]].join("");
    }
    return [first, validChars[0], validChars[1]].join("");
  },
  // option 3: if model is 4+ chars, same as option 2 but skip 2nd char
  // examples: invite = ivt, session = ssn, mfa = mf, setup = stp
  (chars) => {
    if (chars.length < 4) {
      return;
    }
    const first = chars[0];
    const validChars = chars
      .slice(2)
      .filter((c) => {
        return !"aeiou".includes(c);
      })
      .filter((c, i) => {
        return c !== chars[i - 1];
      });
    if (validChars.length == 0) {
      return;
    } else if (validChars.length == 1) {
      return [first, validChars[0], validChars[0]].join("");
    }
    return [first, validChars[0], validChars[1]].join("");
  },
  // option 4: consonants
  // examples: session = sss, setup = stp
  (chars) => {
    return (
      chars[0] +
      chars
        .slice(1)
        .filter((c) => !"aeiou".includes(c))
        .slice(0, 2)
        .join("")
    );
  },
  // option 5: excluding vowels
  // examples: session = sss, setup = stp
  (chars) => {
    return (
      chars[0] +
      chars
        .slice(1)
        .filter((c) => !"aeiou".includes(c))
        .slice(0, 2)
        .join("")
    );
  },
  // option 6: exact characters
  // examples: setup = set
  (chars) => [chars[0], chars[1], chars[2]].join(""),
];

// modelToPrefix takes a model name and previous map of prefixes to model names
// and returns a unique 3-character prefix, or throws an error if a unique
// prefix cannot be generated
function modelToPrefix(model: string, previous: Map<string, string>): string {
  // validate model
  if (model.length < 3) {
    throw new Error("Invalid model name: must be at least 3 characters");
  }

  // get lowercase chars
  const chars = model.toLowerCase().split("");

  // iterate through prefixing options until a unique string is found
  let prefix: string | undefined;
  for (const strategy of prefixingStrategies) {
    prefix = strategy(chars);
    if (prefix && typeof prefix === "string" && prefix.length === 3) {
      // check prefix is unique
      if (!previous.has(prefix)) {
        previous.set(prefix, model);
        return prefix;
      }
    } else if (prefix && prefix.length !== 3) {
      throw new Error(
        "Unxpected length prefix generated for " + model + ": " + prefix,
      );
    }
  }

  throw new Error(`No unique prefix found for model: ${model}`);
}

// modelsToPrefixes takes a list of model names and returns a map of prefixes to
// model names. it checks the models list for duplicates first.
export function modelsToPrefixes(models: string[]): Record<string, string> {
  // if duplicate model names exist, print list of duplicates and exit
  const seen = new Set<string>();
  const duplicates: string[] = [];
  const invalid: string[] = [];
  for (const model of models) {
    // require all characters to be alphabetic lowercase
    if (!model.match(/^[a-z]{1,100}$/)) {
      invalid.push(model);
      continue;
    }
    if (seen.has(model)) {
      duplicates.push(model);
    } else {
      seen.add(model);
    }
  }
  if (invalid.length > 0) {
    throw new Error("Invalid model names found: " + invalid.join(", "));
  }
  if (duplicates.length > 0) {
    throw new Error("Duplicate model names found: " + duplicates.join(", "));
  }
  // generate prefixes and return map
  const previous: Map<string, string> = new Map();
  const prefixes: Record<string, string> = {};
  for (const model of models) {
    const prefix = modelToPrefix(model, previous);
    prefixes[prefix] = model;
  }
  return prefixes;
}
