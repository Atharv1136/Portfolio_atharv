import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutData extends Document {
  bio: string;
  education: string;
  languages: string;
  skills: string[];
  tools: string[];
  updatedAt: Date;
}

const AboutDataSchema = new Schema<IAboutData>({
  bio: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  languages: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
    default: [],
  },
  tools: {
    type: [String],
    required: true,
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Only one about document should exist
AboutDataSchema.index({}, { unique: true });

export const AboutData = mongoose.model<IAboutData>('AboutData', AboutDataSchema);



