interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  BACKEND_URL?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Proxy API requests and uploads to the Vercel backend
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) {
      // Use configured BACKEND_URL from Cloudflare environment, or default Vercel app domain
      const backendBase = (env.BACKEND_URL || "https://portfolio-atharv.vercel.app").replace(/\/$/, "");
      const targetUrl = `${backendBase}${url.pathname}${url.search}`;
      
      // Clone the request with the new target URL
      const newRequest = new Request(targetUrl, request);
      
      // Fetch the response from the Vercel backend
      return fetch(newRequest);
    }

    // Otherwise, serve static files (Vite frontend) from Cloudflare Assets
    return env.ASSETS.fetch(request);
  }
};
