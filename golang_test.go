// Copyright 2025 Nadrama Pty Ltd
// SPDX-License-Identifier: Apache-2.0

package puidv7

import "testing"

func TestDecodePuidv7(t *testing.T) {
	tests := []struct {
		name    string
		id      string
		want    string
		wantErr bool
	}{
		{
			name:    "valid puidv7 lowercase",
			id:      "abc06awcb4f5hzmfey7qwt7s8a6q4",
			want:    "0195c62c-8f2c-7f47-bbc7-bf347ca146b9",
			wantErr: false,
		},
		{
			name:    "valid puidv7 with uppercase input",
			id:      "ABC06AWCB4F5HZMFEY7QWT7S8A6Q4",
			want:    "0195c62c-8f2c-7f47-bbc7-bf347ca146b9",
			wantErr: false,
		},
		{
			name:    "invalid prefix",
			id:      "12306AWCB4F5HZMFEY7QWT7S8A6Q4",
			want:    "",
			wantErr: true,
		},
		{
			name:    "invalid characters",
			id:      "abcIIIOOO789abcdefghjkmnpqrstvwx",
			want:    "",
			wantErr: true,
		},
		{
			name:    "too short",
			id:      "abc123",
			want:    "",
			wantErr: true,
		},
		{
			name:    "too long",
			id:      "abc123456789abcdefghjkmnpqrstvwxyz123",
			want:    "",
			wantErr: true,
		},
		{
			name:    "empty string",
			id:      "",
			want:    "",
			wantErr: true,
		},
		{
			name:    "special characters",
			id:      "abc!@#$%^&*()_+{}[]|\\:;<>,.?/~`",
			want:    "",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Decode(tt.id, "")
			if (err != nil) != tt.wantErr {
				t.Errorf("Decode() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Decode() = %v, want %v", got, tt.want)
			}
		})
	}
}
func TestEncode(t *testing.T) {
	tests := []struct {
		name    string
		uuid    string
		prefix  string
		want    string
		wantErr bool
	}{
		{
			name:    "valid uuid and prefix",
			uuid:    "0195c62c-8f2c-7f47-bbc7-bf347ca146b9",
			prefix:  "abc",
			want:    "abc06awcb4f5hzmfey7qwt7s8a6q4",
			wantErr: false,
		},
		{
			name:    "valid uuid with spaces",
			uuid:    "  0195c62c-8f2c-7f47-bbc7-bf347ca146b9  ",
			prefix:  "xyz",
			want:    "xyz06awcb4f5hzmfey7qwt7s8a6q4",
			wantErr: false,
		},
		{
			name:    "invalid prefix with numbers",
			uuid:    "0195c62c-8f2c-7f47-bbc7-bf347ca146b9",
			prefix:  "123",
			wantErr: true,
		},
		{
			name:    "invalid prefix with special chars",
			uuid:    "0195c62c-8f2c-7f47-bbc7-bf347ca146b9",
			prefix:  "a#c",
			wantErr: true,
		},
		{
			name:    "invalid uuid format",
			uuid:    "not-a-uuid",
			prefix:  "abc",
			wantErr: true,
		},
		{
			name:    "uuid with uppercase",
			uuid:    "0195C62C-8F2C-7F47-BBC7-BF347CA146B9",
			prefix:  "def",
			want:    "def06awcb4f5hzmfey7qwt7s8a6q4",
			wantErr: false,
		},
		{
			name:    "empty uuid",
			uuid:    "",
			prefix:  "abc",
			wantErr: true,
		},
		{
			name:    "empty prefix",
			uuid:    "0195c62c-8f2c-7f47-bbc7-bf347ca146b9",
			prefix:  "",
			wantErr: true,
		},
		{
			name:    "prefix too long",
			uuid:    "0195c62c-8f2c-7f47-bbc7-bf347ca146b9",
			prefix:  "abcd",
			wantErr: true,
		},
		{
			name:    "malformed uuid with correct length",
			uuid:    "0195c62c8f2c7f47bbc7bf347ca146b9aaaaa",
			prefix:  "abc",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Encode(tt.uuid, tt.prefix)
			if (err != nil) != tt.wantErr {
				t.Errorf("Encode() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("Encode() = %v, want %v", got, tt.want)
			}
		})
	}
}
