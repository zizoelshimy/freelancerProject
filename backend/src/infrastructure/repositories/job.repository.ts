import { JobRepository } from "../../domain/interfaces/repositories/job.repository";
import { Job } from "../../domain/entities/job.entity";
import JobModel from "../database/mongodb/models/job.model";

export class MongoJobRepository implements JobRepository {
  async findAll(): Promise<Job[]> {
    try {
      const jobs = await JobModel.find().sort({ createdAt: -1 });
      return jobs.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to fetch jobs: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findById(id: string): Promise<Job | null> {
    try {
      const job = await JobModel.findById(id);
      return job ? this.toDomainEntity(job) : null;
    } catch (error) {
      throw new Error(
        `Failed to find job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findByCategory(category: string): Promise<Job[]> {
    try {
      const jobs = await JobModel.find({ category }).sort({ createdAt: -1 });
      return jobs.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to find jobs by category: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findByClientId(clientId: string): Promise<Job[]> {
    try {
      const jobs = await JobModel.find({ clientId }).sort({ createdAt: -1 });
      return jobs.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to find jobs by client: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findByStatus(status: string): Promise<Job[]> {
    try {
      const jobs = await JobModel.find({ status }).sort({ createdAt: -1 });
      return jobs.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to find jobs by status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async create(job: Job): Promise<Job> {
    try {
      const newJob = new JobModel(job);
      const savedJob = await newJob.save();
      return this.toDomainEntity(savedJob);
    } catch (error) {
      throw new Error(
        `Failed to create job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async update(id: string, jobData: Partial<Job>): Promise<Job | null> {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate(
        id,
        { ...jobData, updatedAt: new Date() },
        { new: true }
      );
      return updatedJob ? this.toDomainEntity(updatedJob) : null;
    } catch (error) {
      throw new Error(
        `Failed to update job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await JobModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(
        `Failed to delete job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async addProposal(jobId: string, proposalId: string): Promise<Job | null> {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate(
        jobId,
        {
          $addToSet: { proposals: proposalId },
          updatedAt: new Date(),
        },
        { new: true }
      );
      return updatedJob ? this.toDomainEntity(updatedJob) : null;
    } catch (error) {
      throw new Error(
        `Failed to add proposal to job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async removeProposal(jobId: string, proposalId: string): Promise<Job | null> {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate(
        jobId,
        {
          $pull: { proposals: proposalId },
          updatedAt: new Date(),
        },
        { new: true }
      );
      return updatedJob ? this.toDomainEntity(updatedJob) : null;
    } catch (error) {
      throw new Error(
        `Failed to remove proposal from job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private toDomainEntity(jobDoc: any): Job {
    return {
      id: jobDoc._id.toString(),
      title: jobDoc.title,
      description: jobDoc.description,
      category: jobDoc.category,
      budget: jobDoc.budget,
      deadline: jobDoc.deadline,
      requirements: jobDoc.requirements,
      clientId: jobDoc.clientId,
      clientName: jobDoc.clientName,
      status: jobDoc.status,
      proposals: jobDoc.proposals,
      selectedProposal: jobDoc.selectedProposal,
      createdAt: jobDoc.createdAt,
      updatedAt: jobDoc.updatedAt,
    };
  }
}
