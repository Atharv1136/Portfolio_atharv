import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
  technologies: Array<{ name: string; color: string }>;
  liveUrl?: string;
  githubUrl: string;
  primaryColor: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  technologies: [{
    name: { type: String, required: true },
    color: { type: String, required: true },
  }],
  liveUrl: {
    type: String,
  },
  githubUrl: {
    type: String,
    required: true,
  },
  primaryColor: {
    type: String,
    required: true,
    default: 'blue',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

