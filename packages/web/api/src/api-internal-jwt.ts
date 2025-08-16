import type { Context } from "hono";
import { sign, verify } from "hono/jwt";
import { decodeBase64 } from "hono/utils/encode";
import { uuidv7 } from "uuidv7";

const ISSUER = "https://www.kaito.tokyo/api/internal";
const ALGORITHM = "HS256";

interface ApiInternalToken {
  iss?: typeof ISSUER;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

interface CustomClaims {
  [key: string]: any;

  iss: never;
  sub: never;
  aud: never;
  exp: never;
  nbf: never;
  iat: never;
  jti: never;
}

interface VerifyTokenOutput {
  success: boolean;
  response?: Response;
  payload?: ApiInternalToken;
}

async function getSecretKey(c: Context): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    new Uint8Array(decodeBase64(c.env.API_INTERNAL_JWT_SECRET)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
};

export async function verifyToken(
  c: Context,
  audience: string,
  token: string,
): Promise<VerifyTokenOutput> {
  const secretKey = await getSecretKey(c);

  let payload: ApiInternalToken;
  try {
    payload = (await verify(token, secretKey, ALGORITHM)) as ApiInternalToken;
  } catch (e) {
    return {
      success: false,
      response: c.json({ error: "Invalid previous state token." }, 400),
    };
  }

  if (payload.iss !== ISSUER) {
    return {
      success: false,
      response: c.json({ error: "Invalid token issuer." }, 400),
    };
  }
  if (payload.aud !== audience) {
    return {
      success: false,
      response: c.json({ error: "Invalid token audience." }, 400),
    };
  }
  if (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000)) {
    return {
      success: false,
      response: c.json({ error: "Token is not active yet." }, 400),
    };
  }
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return {
      success: false,
      response: c.json({ error: "Token has expired." }, 400),
    };
  }
  return { success: true, payload };
}

export async function generateToken(
  c: Context,
  audience: string,
  customClaims: CustomClaims,
): Promise<string> {
  const secretKey = await getSecretKey(c);

  const now = Math.floor(Date.now() / 1000);
  return await sign(
    {
      ...customClaims,
      iss: ISSUER,
      aud: audience,
      exp: now + 60 * 60, // 1 hour
      nbf: now - 5 * 60, // 5 minutes
      iat: now,
      jti: uuidv7(),
    },
    secretKey,
    ALGORITHM,
  );
}
