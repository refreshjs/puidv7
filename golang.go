// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

package puidv7

import (
	"encoding/hex"
	"fmt"
	"regexp"
	"strings"
)

const puidv7PrefixPattern = `^[a-z]{3}$`
const puidv7Pattern = `^[a-z]{3}[0-9a-hj-km-np-tv-z]{26}$`
const uuidPattern = `^[0-9a-f]{8}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{12}$`

// Encode encodes a UUID into a prefixed, crockford base32-encoded string
func Encode(uuid string, prefix string) (string, error) {
	// return error if valid prefix not provided
	if !regexp.MustCompile(puidv7PrefixPattern).MatchString(prefix) {
		return "", fmt.Errorf("invalid prefix %s", prefix)
	}
	// normalize the UUID by converting to lowercase, removing hyphens/newlines/spaces
	uuid = strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(strings.TrimSpace(uuid), " ", ""), "-", ""))
	// check format of the UUID
	if matched, err := regexp.MatchString(uuidPattern, uuid); err != nil || !matched {
		return "", fmt.Errorf("invalid UUID format %s: %s", uuid, err)
	}
	// decode hex to bytes
	decoded, err := hex.DecodeString(uuid)
	if err != nil {
		return "", err
	}
	// encode the UUID to crockford base32 string
	crockfordStr := encodeBase32Crockford(decoded)
	// return with prefix
	return prefix + crockfordStr, nil
}

// Decode decodes a prefixed, crockford base32-encoded string
// into a UUID string, ensuring the prefix matches the one supplied
func Decode(id string, prefix string) (string, error) {
	// normalize by converting to lowercase, removing hyphens/newlines/spaces
	id = strings.ToLower(strings.ReplaceAll(strings.ReplaceAll(strings.TrimSpace(id), " ", ""), "-", ""))
	// check format of the puidv7
	if matched, err := regexp.MatchString(puidv7Pattern, id); err != nil || !matched {
		return "", fmt.Errorf("invalid puidv7 format %s", err)
	}
	// check prefix (if provided)
	if prefix != "" {
		if !strings.HasPrefix(id, prefix) {
			return "", fmt.Errorf("prefix %s does not match %s", prefix, id)
		}
	}
	// decode the crockford base32-encoded UUID to byte slice
	decoded, err := decodeBase32Crockford(id[3:])
	if err != nil {
		return "", err
	}
	// convert byte slice to hex string
	hexStr := fmt.Sprintf("%x", decoded)
	// validate UUID value
	if matched, err := regexp.MatchString(uuidPattern, hexStr); err != nil || !matched {
		return "", fmt.Errorf("invalid UUID %s: %s", hexStr, err)
	}
	// add UUID hyphens
	uuidString := strings.Join([]string{
		hexStr[0:8],
		hexStr[8:12],
		hexStr[12:16],
		hexStr[16:20],
		hexStr[20:32],
	}, "-")
	return uuidString, nil
}
