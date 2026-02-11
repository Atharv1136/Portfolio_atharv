import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BlogPost() {
    const [, params] = useRoute("/blog/:slug");
    const slug = params?.slug;

    const { data: blog, isLoading, error } = useQuery({
        queryKey: ["blog", slug],
        queryFn: async () => {
            if (!slug) return null;
            const res = await fetch(`/api/blogs/${slug}`);
            if (!res.ok) {
                throw new Error("Blog post not found");
            }
            return res.json();
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
                <Link href="/blog">
                    <Button variant="outline">Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Helmet>
                <title>{blog.seoTitle || blog.title} | Atharv's Portfolio</title>
                <meta name="description" content={blog.seoDescription || blog.excerpt} />
                {blog.seoKeywords?.length > 0 && (
                    <meta name="keywords" content={blog.seoKeywords.join(", ")} />
                )}
                <meta property="og:title" content={blog.seoTitle || blog.title} />
                <meta property="og:description" content={blog.seoDescription || blog.excerpt} />
                <meta property="og:image" content={blog.coverImage} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={`https://atharv.dev/blog/${blog.slug}`} />
            </Helmet>

            <Navbar />

            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <Link href="/blog">
                    <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Button>
                </Link>

                <article>
                    <header className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                            <span>{format(new Date(blog.publishedAt || blog.createdAt), "MMMM d, yyyy")}</span>
                            <span>•</span>
                            <span>{blog.author}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                            {blog.title}
                        </h1>
                        {blog.coverImage && (
                            <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
                                <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-wrap justify-center gap-2">
                            {blog.tags?.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    <div
                        className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-bold prose-headings:text-white 
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
}
