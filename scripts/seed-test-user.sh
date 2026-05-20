#!/usr/bin/env bash
# Creates the E2E test user in the locally-running Supabase stack.
# Idempotent: treats "user already exists" as success.
#
# Required env vars:
#   SUPABASE_API_URL   - e.g. http://127.0.0.1:54321
#   SUPABASE_SECRET_KEY        - sb_secret_... (admin/service role)
#   E2E_USER_EMAIL
#   E2E_USER_PASSWORD

set -euo pipefail

: "${SUPABASE_API_URL:?NEXT_PUBLIC_SUPABASE_URL must be set}"
: "${SUPABASE_SECRET_KEY:?SUPABASE_SECRET_KEY must be set}"
: "${E2E_USER_EMAIL:?E2E_USER_EMAIL must be set}"
: "${E2E_USER_PASSWORD:?E2E_USER_PASSWORD must be set}"

payload=$(
  printf '{"email":"%s","password":"%s","email_confirm":true}' \
    "$E2E_USER_EMAIL" "$E2E_USER_PASSWORD"
)

response=$(mktemp)
trap 'rm -f "$response"' EXIT

status=$(
  curl -sS -o "$response" -w '%{http_code}' \
    -X POST "$SUPABASE_API_URL/auth/v1/admin/users" \
    -H "apikey: $SUPABASE_SECRET_KEY" \
    -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H 'Content-Type: application/json' \
    -d "$payload"
)

if [ "$status" = "200" ] || [ "$status" = "201" ]; then
  echo "Seeded test user: $E2E_USER_EMAIL"
  exit 0
fi

if [ "$status" = "422" ] && grep -q 'email_exists\|user_already_exists\|already been registered' "$response"; then
  echo "Test user already exists: $E2E_USER_EMAIL (ok)"
  exit 0
fi

echo "Failed to seed test user (HTTP $status):" >&2
cat "$response" >&2
exit 1
