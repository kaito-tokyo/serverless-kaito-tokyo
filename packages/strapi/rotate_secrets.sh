#!/bin/sh

r()
{
  openssl rand -base64 "$1" | tr -d '\n'
}

echo "$(r 64),$(r 64),$(r 64),$(r 64)" | npx wrangler secret put APP_KEYS

r 64 | npx wrangler secret put ADMIN_JWT_SECRET
r 64 | npx wrangler secret put API_TOKEN_SALT
r 64 | npx wrangler secret put ENCRYPTION_KEY
r 64 | npx wrangler secret put JWT_SECRET
r 64 | npx wrangler secret put TRANSFER_TOKEN_SALT
