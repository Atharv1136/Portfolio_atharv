import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  company: string;
  title: string;
  issued: string;
  platform: string;
  icon: string;
  cardColor: string;
  buttonColor: string;
  titleColor: string;
  textColor: string;
  certImageUrl: string;
  credentialUrl?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>({
  company: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  issued: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  cardColor: {
    type: String,
    required: true,
  },
  buttonColor: {
    type: String,
    required: true,
  },
  titleColor: {
    type: String,
    required: true,
  },
  textColor: {
    type: String,
    required: true,
  },
  certImageUrl: {
    type: String,
    required: true,
  },
  credentialUrl: {
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

export const Certification = mongoose.model<ICertification>('Certification', CertificationSchema);



