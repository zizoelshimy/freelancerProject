import mongoose, { Schema, Document } from "mongoose";

// Experience schema definition
const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, default: "" },
    current: { type: Boolean, default: false },
  },
  { _id: true }
);

// Portfolio item schema definition
const PortfolioItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    fileUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Recent activity schema definition
const RecentActivitySchema = new Schema(
  {
    activity: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
  bio?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    current: boolean;
  }[];
  portfolio: {
    title: string;
    description: string;
    category: string;
    fileUrl?: string;
    createdAt: Date;
  }[];
  recentActivity: {
    activity: string;
    timestamp: Date;
  }[];
  rating: number;
  completedJobs: number;
}

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: [ExperienceSchema],
      default: [],
    },
    portfolio: {
      type: [PortfolioItemSchema],
      default: [],
    },
    recentActivity: {
      type: [RecentActivitySchema],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
