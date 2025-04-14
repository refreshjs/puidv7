// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

package puidv7

import (
	"bytes"
	"testing"
)

func TestEncodeBase32Crockford(t *testing.T) {
	tests := []struct {
		name     string
		input    []byte
		expected string
	}{
		{
			name:     "empty input",
			input:    []byte{},
			expected: "",
		},
		{
			name:     "single byte",
			input:    []byte{0x1F},
			expected: "3w",
		},
		{
			name:     "multiple bytes",
			input:    []byte{0xAB, 0xCD, 0xEF},
			expected: "nf6yy",
		},
		{
			name:     "all zeros",
			input:    []byte{0x00, 0x00, 0x00},
			expected: "00000",
		},
		{
			name:     "all ones",
			input:    []byte{0xFF, 0xFF, 0xFF},
			expected: "zzzzy",
		},
		{
			name:     "partial byte boundary",
			input:    []byte{0xAB, 0xCD},
			expected: "nf6g",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := encodeBase32Crockford(tt.input)
			if result != tt.expected {
				t.Errorf("EncodeBase32Crockford(%v) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}
func TestDecodeBase32Crockford(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected []byte
		wantErr  bool
	}{
		{
			name:     "decode with hyphens",
			input:    "VP-SZ-V",
			expected: []byte{0xDD, 0xB3, 0xFD},
			wantErr:  false,
		},
		{
			name:     "decode with spaces",
			input:    "VP SZ V",
			expected: []byte{0xDD, 0xB3, 0xFD},
			wantErr:  false,
		},
		{
			name:     "decode with mixed separators",
			input:    "VP-SZ V",
			expected: []byte{0xDD, 0xB3, 0xFD},
			wantErr:  false,
		},
		{
			name:     "decode with leading/trailing whitespace",
			input:    "  VPSZV\n",
			expected: []byte{0xDD, 0xB3, 0xFD},
			wantErr:  false,
		},
		{
			name:     "invalid character",
			input:    "VPS!V",
			expected: nil,
			wantErr:  true,
		},
		{
			name:     "decode with lowercase",
			input:    "vpszv",
			expected: []byte{0xDD, 0xB3, 0xFD},
			wantErr:  false,
		},
		{
			name:     "partial bits remaining",
			input:    "VPSZVH",
			expected: []byte{},
			wantErr:  true,
		},
		{
			name:     "empty string with whitespace",
			input:    "   \n  ",
			expected: []byte{},
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := decodeBase32Crockford(tt.input)
			if (err != nil) != tt.wantErr {
				t.Errorf("DecodeBase32Crockford(%q) error = %v, wantErr %v", tt.input, err, tt.wantErr)
				return
			}
			if !tt.wantErr && !bytes.Equal(result, tt.expected) {
				t.Errorf("DecodeBase32Crockford(%q) = %v, want %v", tt.input, result, tt.expected)
			}
		})
	}
}
