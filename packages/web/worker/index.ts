export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/vip")) {
      const authorizationHeader = request.headers.get("Authorization");

      if (!authorizationHeader) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    // If not a /vip path or Authorization header is present, proceed with the request
    const response = await env.ASSETS.fetch(request);

    const cfAccessJwtAssertion = request.headers.get("Cf-Access-Jwt-Assertion");

    if (cfAccessJwtAssertion) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Cf-Access-Jwt-Assertion", cfAccessJwtAssertion);
      return newResponse;
    }

    return response;
  },
};
