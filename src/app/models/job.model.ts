export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  deadline: Date;
  status: JobStatus;
  requirements: string[];
  attachments?: string[];
  clientId: string;
  clientName: string;
  proposals: JobProposal[];
  acceptedProposal?: string;
  createdAt: Date;
}

export interface JobProposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  proposedAmount: number;
  coverLetter: string;
  deliveryTime: number;
  status: ProposalStatus;
  createdAt: Date;
}

export enum JobCategory {
  WORD_PROCESSING = 'word-processing',
  EXCEL_DATA_ENTRY = 'excel-data-entry',
  DESIGN = 'design',
  TYPESETTING = 'typesetting'
}

export enum JobStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProposalStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}