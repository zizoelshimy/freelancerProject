import { Proposal } from "../../entities/job.entity";

export interface ProposalRepository {
  findAll(): Promise<Proposal[]>;
  findById(id: string): Promise<Proposal | null>;
  findByJobId(jobId: string): Promise<Proposal[]>;
  findByFreelancerId(freelancerId: string): Promise<Proposal[]>;
  findByStatus(status: string): Promise<Proposal[]>;
  create(proposal: Proposal): Promise<Proposal>;
  update(id: string, proposal: Partial<Proposal>): Promise<Proposal | null>;
  delete(id: string): Promise<boolean>;
}
