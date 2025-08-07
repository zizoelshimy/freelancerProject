import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import {
  CreateJobUseCase,
  GetAllJobsUseCase,
  GetJobByIdUseCase,
  GetJobsByCategoryUseCase,
  GetJobsByClientUseCase,
  UpdateJobUseCase,
  DeleteJobUseCase,
} from "../../../application/use-cases/job/job-operations.use-case";
import { MongoUserRepository } from "../../../infrastructure/repositories/user.repository";

export class JobController {
  constructor(
    private createJobUseCase: CreateJobUseCase,
    private getAllJobsUseCase: GetAllJobsUseCase,
    private getJobByIdUseCase: GetJobByIdUseCase,
    private getJobsByCategoryUseCase: GetJobsByCategoryUseCase,
    private getJobsByClientUseCase: GetJobsByClientUseCase,
    private updateJobUseCase: UpdateJobUseCase,
    private deleteJobUseCase: DeleteJobUseCase
  ) {}

  async createJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const jobData = req.body;
      const clientId = req.user?.userId;

      if (!clientId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      // Get user details to fetch the client name
      const userRepository = new MongoUserRepository();
      const user = await userRepository.findById(clientId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const job = await this.createJobUseCase.execute({
        ...jobData,
        clientId,
        clientName: user.fullName,
      });

      res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to create job",
      });
    }
  }

  async getAllJobs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const jobs = await this.getAllJobsUseCase.execute();

      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to retrieve jobs",
      });
    }
  }

  async getJobById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const job = await this.getJobByIdUseCase.execute(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to retrieve job",
      });
    }
  }

  async getJobsByCategory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { category } = req.params;
      const jobs = await this.getJobsByCategoryUseCase.execute(category);

      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve jobs by category",
      });
    }
  }

  async updateJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const jobData = req.body;
      const clientId = req.user?.userId;

      if (!clientId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      // First check if the job belongs to the client
      const existingJob = await this.getJobByIdUseCase.execute(id);
      if (!existingJob) {
        res.status(404).json({
          success: false,
          error: "Job not found",
        });
        return;
      }

      if (existingJob.clientId !== clientId) {
        res.status(403).json({
          success: false,
          error: "You can only update your own jobs",
        });
        return;
      }

      const updatedJob = await this.updateJobUseCase.execute(id, jobData);

      res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: updatedJob,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update job",
      });
    }
  }

  async deleteJob(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clientId = req.user?.userId;

      if (!clientId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const deleted = await this.deleteJobUseCase.execute(id, clientId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error:
            "Job not found or you do not have permission to delete this job",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete job",
      });
    }
  }

  async getMyJobs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const clientId = req.user?.userId;

      if (!clientId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const jobs = await this.getJobsByClientUseCase.execute(clientId);

      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve your jobs",
      });
    }
  }
}
