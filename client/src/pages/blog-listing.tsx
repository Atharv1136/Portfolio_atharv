import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

export default function BlogListing() {
    const { data: blogs, isLoading } = useQuery({
        queryKey: ["public-blogs"],
        queryFn: async () => {
            const res = await fetch("/api/blogs");
            return res.json();
        },
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <Helmet>
                <title>Blog | Atharv's Portfolio</title>
                <meta name="description" content="Read my latest thoughts, tutorials, and insights on web development and technology." />
            </Helmet>

            <Navbar />

            <main className="container mx-auto px-4 py-24">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Latest Updates
                </h1>

                {isLoading ? (
                    <div className="text-center text-gray-400">Loading posts...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs?.map((blog: any) => (
                            <Link key={blog.id} href={`/blog/${blog.slug}`}>
                                <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 overflow-hidden cursor-pointer group h-full flex flex-col">
                                    {blog.coverImage && (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{format(new Date(blog.publishedAt || blog.createdAt), "MMM d, yyyy")}</span>
                                            <span>•</span>
                                            <span>{blog.author}</span>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {blog.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription className="line-clamp-3 text-gray-400">
                                            {blog.excerpt}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter className="flex flex-wrap gap-2 pt-0">
                                        {blog.tags?.map((tag: string) => (
                                            <span key={tag} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-gray-300">
                                                #{tag}
                                            </span>
                                        ))}
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {blogs?.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        No blog posts available yet. Check back soon!
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
