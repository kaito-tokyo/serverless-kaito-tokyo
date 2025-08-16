/// <reference path="../../worker-configuration.d.ts" />

import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import { decodeBase64 } from "hono/utils/encode";
import { uuidv7 } from "uuidv7";
import type { RoleplayActor } from "../../src/interfaces/RoleplayActor";

type Bindings = {
  AI: Ai;
  ASSETS: Fetcher;
  API_JWS_SECRET: string;
  RATE_LIMITER_20_PER_5_MINUTES: RateLimit;
  RATE_LIMITER_100_PER_HOUR: RateLimit;
};

type Message = {
  role: string;
  content: string;
};

type ChatState = {
  previousMessages: Message[];
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/api/vip/roleplay-chat/:slug",
  cors({
    origin: ["http://localhost:4321", "https://www.kaito.tokyo"],
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  }),
);

app.use("/api/vip/roleplay-chat/:slug", async (c, next) => {
  const ip = c.req.header("cf-connecting-ip");
  if (!ip) {
    return c.json({ error: "Could not determine client IP." }, 400);
  }

  const { success: success20 } =
    await c.env.RATE_LIMITER_20_PER_5_MINUTES.limit({
      key: ip,
    });
  if (!success20) {
    return c.json(
      { error: "Rate limit exceeded (20 requests per 5 minutes)." },
      429,
    );
  }

  const { success: success100 } = await c.env.RATE_LIMITER_100_PER_HOUR.limit({
    key: ip,
  });
  if (!success100) {
    return c.json(
      { error: "Rate limit exceeded (100 requests per hour)." },
      429,
    );
  }

  await next();
});

app.post("/api/vip/roleplay-chat/:slug", async (c) => {
  const slug = c.req.param("slug");
  const audience = `https://www.kaito.tokyo/api/vip/roleplay-chat/${slug}`;

  const params = await c.req.parseBody();
  const nextUserMessage = params.message as string;
  const previousStateJws = params.previousState as string | undefined;
  let previousMessages: Message[] = [];
  const secretKey = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(decodeBase64(c.env.API_JWS_SECRET)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  if (previousStateJws) {
    try {
      const payload = (await verify(
        previousStateJws.toString(),
        secretKey,
        "HS256",
      )) as ChatState & { iss?: string; aud?: string; nbf?: number };
      if (payload.iss !== "https://www.kaito.tokyo/api/internal") {
        return c.json({ error: "Invalid token issuer." }, 400);
      }
      if (payload.aud !== audience) {
        return c.json({ error: "Invalid token audience." }, 400);
      }
      if (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000)) {
        return c.json({ error: "Token is not active yet." }, 400);
      }
      if (payload) {
        previousMessages = payload.previousMessages;
      }
    } catch (e) {
      return c.json({ error: "Invalid previous state token." }, 400);
    }
  }

  if (!nextUserMessage) {
    return c.json(
      { error: 'Please provide a "message" in the request body.' },
      400,
    );
  }

  if ([...nextUserMessage].length > 140) {
    return c.json(
      { error: "The message must be 140 characters or less." },
      400,
    );
  }

  const assetPath = `/internal/roleplay-actor/${slug}.json`;
  const assetUrl = new URL(assetPath, "http://internal");

  const assetResponse = await c.env.ASSETS.fetch(new Request(assetUrl));

  if (!assetResponse.ok) {
    return c.json({ error: "System prompt asset not found." }, 404);
  }

  const { SystemPrompt }: RoleplayActor = await assetResponse.json();

  const messages: Message[] = [
    { role: "system", content: SystemPrompt },
    ...previousMessages,
    { role: "user", content: nextUserMessage },
  ];

  const { response } = await c.env.AI.run("@cf/google/gemma-3-12b-it", {
    messages,
  });

  const responseMessages: Message[] = [
    ...previousMessages,
    { role: "user", content: nextUserMessage },
    { role: "assistant", content: response },
  ];

  const now = Math.floor(Date.now() / 1000);
  const previousState = await sign(
    {
      jti: uuidv7(),
      previousMessages: responseMessages,
      exp: now + 60 * 60, // 1 hour
      iss: "https://www.kaito.tokyo/api/internal",
      aud: audience,
      nbf: now - 5 * 60, // 5 minutes
      iat: now,
    },
    secretKey,
    "HS256",
  );

  return c.json({ response, previousState });
});

export default app;
