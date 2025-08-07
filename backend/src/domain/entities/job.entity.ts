// Domain entity for Job
export interface Job {
  id?: string;
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  deadline: Date;
  requirements: string[];
  clientId: string; // User who posted the job
  clientName: string;
  status: JobStatus;
  proposals: string[]; // Array of proposal IDs
  selectedProposal?: string; // ID of accepted proposal
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Proposal {
  id?: string;
  jobId: string;
  freelancerId: string; // User who submitted the proposal
  freelancerName: string;
  rate: number; // Proposed rate in dollars
  deliveryTime: number; // Delivery time in days
  coverLetter: string;
  status: ProposalStatus;
  submittedAt?: Date;
  updatedAt?: Date;
}

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

export enum ProposalStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}
