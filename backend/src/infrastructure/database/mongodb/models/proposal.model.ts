import mongoose, { Schema, Document } from "mongoose";

export enum ProposalStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export interface IProposal extends Document {
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  rate: number;
  deliveryTime: number;
  coverLetter: string;
  status: ProposalStatus;
  submittedAt: Date;
  updatedAt: Date;
}

const ProposalSchema: Schema = new Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    freelancerId: {
      type: String,
      required: true,
    },
    freelancerName: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: 1,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ProposalStatus),
      default: ProposalStatus.PENDING,
    },
  },
  {
    timestamps: {
      createdAt: "submittedAt",
      updatedAt: true,
    },
  }
);

// Add indexes for better query performance
ProposalSchema.index({ jobId: 1 });
ProposalSchema.index({ freelancerId: 1 });
ProposalSchema.index({ status: 1 });
ProposalSchema.index({ submittedAt: -1 });

// Ensure a freelancer can only submit one proposal per job
ProposalSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model<IProposal>("Proposal", ProposalSchema);
