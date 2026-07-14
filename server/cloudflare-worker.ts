interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Proxy API requests and uploads to the Render backend
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) {
      const targetUrl = `https://portfolio-atharv-01j4.onrender.com${url.pathname}${url.search}`;
      
      // Clone the request with the new target URL
      const newRequest = new Request(targetUrl, request);
      
      // Fetch the response from the Render backend
      return fetch(newRequest);
    }

    // Otherwise, serve static files (Vite frontend) from Cloudflare Assets
    return env.ASSETS.fetch(request);
  }
};
