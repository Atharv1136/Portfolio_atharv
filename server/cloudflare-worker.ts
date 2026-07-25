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
      // Use configured BACKEND_URL or default to exact Vercel deployment URL
      const backendBase = (env.BACKEND_URL || "https://portfolio-atharv-72k8-eight.vercel.app").replace(/\/$/, "");
      const targetUrl = `${backendBase}${url.pathname}${url.search}`;
      
      const newRequest = new Request(targetUrl, request);
      return fetch(newRequest);
    }

    // Otherwise, serve static files (Vite frontend) from Cloudflare Assets
    return env.ASSETS.fetch(request);
  }
};
