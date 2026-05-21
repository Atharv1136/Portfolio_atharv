import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from './lib/storage';
import { connectToDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (process.env.STORAGE_TYPE === 'mongodb') {
      await connectToDatabase();
    }

    const storage = await getStorage();
    const blogs = await storage.getAllBlogs(true); // only published

    const BASE_URL = 'https://atharvbhosale.site';
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { loc: '/', changefreq: 'monthly', priority: '1.0' },
      { loc: '/#about', changefreq: 'monthly', priority: '0.9' },
      { loc: '/#experience', changefreq: 'monthly', priority: '0.9' },
      { loc: '/#projects', changefreq: 'weekly', priority: '0.95' },
      { loc: '/#certifications', changefreq: 'monthly', priority: '0.8' },
      { loc: '/#hackathons', changefreq: 'monthly', priority: '0.8' },
      { loc: '/#contact', changefreq: 'monthly', priority: '0.9' },
      { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    // Add all published blog posts dynamically
    for (const blog of blogs) {
      const raw = blog && typeof blog.toObject === 'function' ? blog.toObject() : blog;
      const slug = raw.slug;
      const lastmod = raw.publishedAt
        ? new Date(raw.publishedAt).toISOString().split('T')[0]
        : raw.updatedAt
        ? new Date(raw.updatedAt).toISOString().split('T')[0]
        : today;

      xml += `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    xml += `
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (error: any) {
    console.error('❌ Error generating sitemap:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
}
