/// <reference path="../../worker-configuration.d.ts" />

import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import type { RoleplayActor } from "../../src/interfaces/RoleplayActor";

type Bindings = {
  AI: Ai;
  ASSETS: Fetcher;
  API_JWS_SECRET: string;
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

app.post("/api/vip/roleplay-chat/:slug", async (c) => {
  const slug = c.req.param("slug");
  const params = await c.req.parseBody();
  const nextUserMessage = params.message as string;
  const previousStateJws = params.previousState as string | undefined;
  let previousMessages: Message[] = [];
  if (previousStateJws) {
    try {
      const payload = (await verify(
        previousStateJws.toString(),
        c.env.API_JWS_SECRET,
      )) as ChatState;
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

  const previousState = await sign(
    { previousMessages: responseMessages },
    c.env.API_JWS_SECRET,
  );

  return c.json({ response, previousState });
});

export default app;
