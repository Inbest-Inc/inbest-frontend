export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Try to serve static files first
    try {
      const res = await env.ASSETS.fetch(request);
      if (res.ok) return res;
    } catch (e) {}

    // If static file not found, serve the app
    const res = await env.ASSETS.fetch(`${url.origin}/index.html`);
    return new Response(res.body, {
      ...res,
      headers: {
        ...res.headers,
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
