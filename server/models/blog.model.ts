import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: string;
    tags: string[];
    isPublished: boolean;
    publishedAt: Date | null;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: { type: String, required: true },
        coverImage: { type: String, required: true },
        author: { type: String, required: true },
        tags: [{ type: String }],
        isPublished: { type: Boolean, default: false },
        publishedAt: { type: Date, default: null },
        seoTitle: { type: String },
        seoDescription: { type: String },
        seoKeywords: [{ type: String }],
    },
    { timestamps: true }
);

export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
