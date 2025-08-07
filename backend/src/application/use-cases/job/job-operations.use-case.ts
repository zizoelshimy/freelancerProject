import { JobRepository } from "../../../domain/interfaces/repositories/job.repository";
import { Job, JobStatus } from "../../../domain/entities/job.entity";

export class CreateJobUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(
    jobData: Omit<
      Job,
      "id" | "proposals" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<Job> {
    try {
      const newJob: Job = {
        ...jobData,
        status: JobStatus.OPEN,
        proposals: [],
      };

      return await this.jobRepository.create(newJob);
    } catch (error) {
      throw new Error(
        `Failed to create job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class GetAllJobsUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(): Promise<Job[]> {
    try {
      return await this.jobRepository.findAll();
    } catch (error) {
      throw new Error(
        `Failed to get jobs: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class GetJobByIdUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(id: string): Promise<Job | null> {
    try {
      return await this.jobRepository.findById(id);
    } catch (error) {
      throw new Error(
        `Failed to get job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class GetJobsByCategoryUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(category: string): Promise<Job[]> {
    try {
      if (category === "all-jobs") {
        return await this.jobRepository.findAll();
      }
      return await this.jobRepository.findByCategory(category);
    } catch (error) {
      throw new Error(
        `Failed to get jobs by category: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class GetJobsByClientUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(clientId: string): Promise<Job[]> {
    try {
      return await this.jobRepository.findByClientId(clientId);
    } catch (error) {
      throw new Error(
        `Failed to get jobs by client: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class UpdateJobUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(id: string, jobData: Partial<Job>): Promise<Job | null> {
    try {
      return await this.jobRepository.update(id, jobData);
    } catch (error) {
      throw new Error(
        `Failed to update job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class DeleteJobUseCase {
  constructor(private jobRepository: JobRepository) {}

  async execute(id: string, clientId: string): Promise<boolean> {
    try {
      // First check if the job exists and belongs to the client
      const job = await this.jobRepository.findById(id);
      if (!job) {
        throw new Error("Job not found");
      }

      if (job.clientId !== clientId) {
        throw new Error("You can only delete your own jobs");
      }

      return await this.jobRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Failed to delete job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
