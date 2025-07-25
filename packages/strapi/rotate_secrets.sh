#!/bin/sh

r()
{
  openssl rand -base64 64 | tr -d '\n'
}

echo "$(r),$(r),$(r),$(r)" | npx wrangler secret put APP_KEYS

r | npx wrangler secret put ADMIN_JWT_SECRET
r | npx wrangler secret put API_TOKEN_SALT
r | npx wrangler secret put ENCRYPTION_KEY
r | npx wrangler secret put JWT_SECRET
r | npx wrangler secret put TRANSFER_TOKEN_SALT
