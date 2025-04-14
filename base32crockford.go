// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

package puidv7

import (
	"encoding/base32"
	"fmt"
	"strings"
)

// crockfordAlphabet is a Base32 alphabet as defined by Douglas Crockford.
// It removes I, L, O, U to avoid confusion.
// https://www.crockford.com/base32.html
const crockfordAlphabet = "0123456789abcdefghjkmnpqrstvwxyz"

// crockfordEncoding is a Base32 encoding schema using the crockfordAlphabet
var crockfordEncoding = base32.NewEncoding(crockfordAlphabet).WithPadding(base32.NoPadding)

// encodeBase32Crockford encodes the input bytes to Crockford Base32 string
func encodeBase32Crockford(data []byte) string {
	return crockfordEncoding.EncodeToString(data)
}

// decodeBase32Crockford decodes a Crockford Base32 string to bytes
func decodeBase32Crockford(s string) ([]byte, error) {
	// Normalize by converting to lowercase and removing hyphens/newlines/spaces
	normalized := strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(strings.TrimSpace(s), "-", ""), " ", ""))
	if len(normalized) == 0 {
		return nil, fmt.Errorf("empty string")
	}

	// Replace common lookalike characters with their canonical form
	normalized = strings.Map(func(r rune) rune {
		switch r {
		case 'i', 'l':
			return '1'
		case 'o':
			return '0'
		default:
			return r
		}
	}, normalized)

	decoded, err := crockfordEncoding.DecodeString(normalized)
	if err != nil {
		return nil, err
	}
	if len(decoded) == 0 {
		return nil, fmt.Errorf("invalid Base32 string length")
	}
	return decoded, nil
}
