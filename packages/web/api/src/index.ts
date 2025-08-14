/// <reference path="../../worker-configuration.d.ts" />

import { Hono } from "hono";

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

  const assetPath = `/vip/roleplay-chat/system-prompt/${slug}.txt`;
  const url = new URL(c.req.url);
  const assetUrl = `${url.origin}${assetPath}`;

  const assetResponse = await c.env.ASSETS.fetch(new Request(assetUrl));

  if (!assetResponse.ok) {
    return c.json({ error: "System prompt asset not found." }, 404);
  }

  const system_prompt = await assetResponse.text();

  const messages = [
    { role: "system", content: system_prompt },
    { role: "user", content: message as string },
  ];

  const response = await c.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
    messages,
  });

  return c.json(response);
});

export default app;
