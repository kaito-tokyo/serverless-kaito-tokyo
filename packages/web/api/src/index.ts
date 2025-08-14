/// <reference path="../../worker-configuration.d.ts" />

import { Hono } from "hono";
import type { RoleplayActor } from "../../src/interfaces/RoleplayActor";

type Bindings = {
  AI: Ai;
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/api/vip/roleplay-chat/:slug", async (c) => {
  const slug = c.req.param("slug");
  const { message } = await c.req.parseBody();

  if (!message) {
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
    { role: "user", content: message as string },
  ];

  const response = await c.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
    messages,
  });

  return c.json(response);
});

export default app;
