import { Job } from "../../entities/job.entity";

export interface JobRepository {
  findAll(): Promise<Job[]>;
  findById(id: string): Promise<Job | null>;
  findByCategory(category: string): Promise<Job[]>;
  findByClientId(clientId: string): Promise<Job[]>;
  findByStatus(status: string): Promise<Job[]>;
  create(job: Job): Promise<Job>;
  update(id: string, job: Partial<Job>): Promise<Job | null>;
  delete(id: string): Promise<boolean>;
  addProposal(jobId: string, proposalId: string): Promise<Job | null>;
  removeProposal(jobId: string, proposalId: string): Promise<Job | null>;
}
