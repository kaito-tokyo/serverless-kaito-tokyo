export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const response = await env.ASSETS.fetch(request);

    const url = new URL(request.url);
    if (!url.pathname.startsWith("/vip")) {
      return response;
    }

    const cfAccessJwtAssertion = request.headers.get("Cf-Access-Jwt-Assertion");

    if (cfAccessJwtAssertion) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Cf-Access-Jwt-Assertion", cfAccessJwtAssertion);
      return newResponse;
    }

    return response;
  },
};
