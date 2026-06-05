import mongoose, { Document, Schema } from 'mongoose';

export interface IPublication extends Document {
    title: string;
    publisher: string;
    publicationDate: string;
    url?: string;
    description: string;
    authors: string;
    logoUrl?: string;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const PublicationSchema = new Schema<IPublication>(
    {
        title: { type: String, required: true },
        publisher: { type: String, required: true },
        publicationDate: { type: String, required: true },
        url: { type: String, default: '' },
        description: { type: String, required: true },
        authors: { type: String, required: true },
        logoUrl: { type: String, default: '' },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Publication = mongoose.model<IPublication>('Publication', PublicationSchema);
