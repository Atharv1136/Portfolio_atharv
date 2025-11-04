import mongoose, { Schema, Document } from 'mongoose';

export interface IHackathon extends Document {
  name: string;
  role: string;
  organizer: string;
  side: 'left' | 'right';
  delay: number;
  certificateUrl?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema = new Schema<IHackathon>({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  side: {
    type: String,
    enum: ['left', 'right'],
    required: true,
    default: 'left',
  },
  delay: {
    type: Number,
    default: 0,
  },
  certificateUrl: {
    type: String,
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

export const Hackathon = mongoose.model<IHackathon>('Hackathon', HackathonSchema);



