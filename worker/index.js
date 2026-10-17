export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    // Every public page is pre-rendered. Unknown HTML URLs must remain 404,
    // rather than returning the home page with a misleading 200 status.
    const missingUrl = new URL(request.url);
    missingUrl.pathname = "/404.html";
    missingUrl.search = "";
    const missing = await env.ASSETS.fetch(new Request(missingUrl, request));
    if (!missing.ok) return response;
    const headers = new Headers(missing.headers);
    headers.set("X-Robots-Tag", "noindex");
    return new Response(request.method === "HEAD" ? null : missing.body, { status: 404, headers });
  },
};
