/// <reference path="../../worker-configuration.d.ts" />

import { Hono } from "hono";
import { cors } from "hono/cors";
import type { RoleplayActor } from "../../src/interfaces/RoleplayActor";

type Bindings = {
  AI: Ai;
  ASSETS: Fetcher;
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
  let previousMessages = params.previousMessages
    ? JSON.parse(params.previousMessages.toString())
    : [];
  const { nextUserMessage } = params;

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

  const messages = [
    { role: "system", content: SystemPrompt },
    ...previousMessages,
    { role: "user", content: nextUserMessage },
  ];

  const { response } = await c.env.AI.run("@cf/google/gemma-3-12b-it", {
    messages,
  });

  const responseMessages = [
    ...previousMessages,
    { role: "user", content: nextUserMessage },
    { role: "assistant", content: response },
  ];

  return c.json(responseMessages);
});

export default app;
