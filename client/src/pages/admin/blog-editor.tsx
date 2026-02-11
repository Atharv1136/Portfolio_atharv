import { useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";

export default function BlogEditor({ params }: { params?: { id?: string } }) {
    const { id } = params || {};
    const isEditing = !!id;
    const [location, setLocation] = useLocation();
    const { toast } = useToast();
    const quillRef = useRef<ReactQuill>(null);

    const { data: blog, isLoading } = useQuery({
        queryKey: isEditing ? ["blog", id] : [],
        queryFn: async () => {
            if (!isEditing) return null;
            const res = await fetch(`/api/blogs/${id}`); // Note: public API gets by slug, admin API gets by ID? Wait, public gets by slug. Admin update needs ID.
            // Let's assume we fetch by ID for editing if we have an admin endpoint for it, or we filter from list?
            // Actually my routes.ts didn't add GET /api/admin/blogs/:id. It only has GET /api/blogs/:slug (public) and GET /api/admin/blogs (list).
            // I should fix routes to add GET /api/admin/blogs/:id or use the slug if possible but ID is safer for editing.
            // For now, let's fetch the list and find it, or use the public slug endpoint if we have the slug?
            // But we only have the ID here.
            // Let's rely on the list cache or fetch the specific blog by ID.
            // Wait, I missed GET /api/admin/blogs/:id in routes.ts. I added PUT and DELETE.
            // I should add GET /api/admin/blogs/:id to routes.ts.
            // For now, to proceed, I'll implement the editor assuming the endpoint exists or I'll add it.
            // Let's add it to routes.ts quickly or use the list.
            // Actually, storage.getBlogById is available. I will add the route in the next step.
            const response = await apiRequest("GET", `/api/admin/blogs/${id}`);
            return response.json();
        },
        enabled: isEditing,
    });

    const form = useForm({
        defaultValues: {
            title: blog?.title || "",
            slug: blog?.slug || "",
            excerpt: blog?.excerpt || "",
            coverImage: blog?.coverImage || "",
            isPublished: blog?.isPublished || false,
            seoTitle: blog?.seoTitle || "",
            seoDescription: blog?.seoDescription || "",
            seoKeywords: blog?.seoKeywords?.join(", ") || "",
            content: blog?.content || "",
        },
        values: blog ? {
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            coverImage: blog.coverImage,
            isPublished: blog.isPublished,
            seoTitle: blog.seoTitle,
            seoDescription: blog.seoDescription,
            seoKeywords: blog.seoKeywords?.join(", "),
            content: blog.content,
        } : undefined
    });

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                const quill = quillRef.current?.getEditor();
                const range = quill?.getSelection();
                if (quill && range) {
                    quill.insertEmbed(range.index, "image", data.imageUrl);
                }
            } catch (error) {
                console.error("Image upload failed", error);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "code-block"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), []);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            // split keywords
            const keywords = data.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean);
            const payload = { ...data, seoKeywords: keywords };

            if (isEditing) {
                await apiRequest("PUT", `/api/admin/blogs/${id}`, payload);
            } else {
                await apiRequest("POST", "/api/admin/blogs", payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] }); // invalidate list
            toast({ title: "Success", description: "Blog post saved successfully." });
            setLocation("/admin/blogs");
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? "Edit Blog" : "Create New Blog"}</h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...form.register("title")} onChange={(e) => {
                            form.setValue("title", e.target.value);
                            if (!isEditing) {
                                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                                form.setValue("slug", slug);
                            }
                        }} />
                    </div>

                    <div className="space-y-2">
                        <Label>Slug</Label>
                        <Input {...form.register("slug")} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Content (Headers H1-H2 supported for best SEO)</Label>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={form.watch("content")}
                        onChange={(val) => form.setValue("content", val)}
                        modules={modules}
                        className="min-h-[300px] mb-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea {...form.register("excerpt")} />
                </div>

                <div className="space-y-2">
                    <Label>Cover Image URL</Label>
                    <Input {...form.register("coverImage")} placeholder="https://..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md">
                    <div className="space-y-2">
                        <Label>SEO Title</Label>
                        <Input {...form.register("seoTitle")} />
                    </div>
                    <div className="space-y-2">
                        <Label>SEO Keywords (comma separated)</Label>
                        <Input {...form.register("seoKeywords")} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>SEO Description</Label>
                        <Textarea {...form.register("seoDescription")} />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="published" checked={form.watch("isPublished")} onCheckedChange={(c) => form.setValue("isPublished", !!c)} />
                    <Label htmlFor="published">Publish immediately</Label>
                </div>

                <div className="flex justify-between gap-4 mt-8">
                    <Button type="button" variant="outline" onClick={() => setLocation("/")}>
                        Back to Website
                    </Button>
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setLocation("/admin/blogs")}>
                            Back to Dashboard
                        </Button>
                        {isEditing && form.getValues("slug") && (
                            <Button type="button" variant="secondary" onClick={() => window.open(`/blog/${form.getValues("slug")}`, '_blank')}>
                                <Eye className="w-4 h-4 mr-2" /> View Live
                            </Button>
                        )}
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Saving..." : "Save Blog"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
