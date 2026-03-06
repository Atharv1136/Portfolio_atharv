import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    company: string;
    role: string;
    description: string;
    duration: string;
    logoUrl?: string;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
    {
        company: { type: String, required: true },
        role: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String, required: true },
        logoUrl: { type: String, default: '' },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
