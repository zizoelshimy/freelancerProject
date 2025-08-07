import mongoose, { Schema, Document } from "mongoose";

// Define enums locally to avoid import issues during development
export enum JobCategory {
  WORD_PROCESSING = "word-processing",
  EXCEL_DATA_ENTRY = "excel-data-entry",
  DESIGN = "design",
  TYPESETTING = "typesetting",
  ALL_JOBS = "all-jobs",
}

export enum JobStatus {
  OPEN = "open",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface IJob extends Document {
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  deadline: Date;
  requirements: string[];
  clientId: string;
  clientName: string;
  status: JobStatus;
  proposals: string[];
  selectedProposal?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(JobCategory),
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    clientId: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
    proposals: {
      type: [String],
      default: [],
    },
    selectedProposal: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
JobSchema.index({ category: 1 });
JobSchema.index({ clientId: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ createdAt: -1 });

export default mongoose.model<IJob>("Job", JobSchema);
