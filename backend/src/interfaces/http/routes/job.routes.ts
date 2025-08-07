import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { MongoJobRepository } from "../../../infrastructure/repositories/job.repository";
import { MongoProposalRepository } from "../../../infrastructure/repositories/proposal.repository";
import {
  CreateJobUseCase,
  GetAllJobsUseCase,
  GetJobByIdUseCase,
  GetJobsByCategoryUseCase,
  GetJobsByClientUseCase,
  UpdateJobUseCase,
  DeleteJobUseCase,
} from "../../../application/use-cases/job/job-operations.use-case";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Initialize repositories
const jobRepository = new MongoJobRepository();
const proposalRepository = new MongoProposalRepository();

// Initialize use cases
const createJobUseCase = new CreateJobUseCase(jobRepository);
const getAllJobsUseCase = new GetAllJobsUseCase(jobRepository);
const getJobByIdUseCase = new GetJobByIdUseCase(jobRepository);
const getJobsByCategoryUseCase = new GetJobsByCategoryUseCase(jobRepository);
const getJobsByClientUseCase = new GetJobsByClientUseCase(jobRepository);
const updateJobUseCase = new UpdateJobUseCase(jobRepository);
const deleteJobUseCase = new DeleteJobUseCase(jobRepository);

// Initialize controller
const jobController = new JobController(
  createJobUseCase,
  getAllJobsUseCase,
  getJobByIdUseCase,
  getJobsByCategoryUseCase,
  getJobsByClientUseCase,
  updateJobUseCase,
  deleteJobUseCase
);

// Public routes (no auth required for reading)
router.get("/jobs", (req, res) => jobController.getAllJobs(req, res));
router.get("/jobs/:id", (req, res) => jobController.getJobById(req, res));
router.get("/jobs/category/:category", (req, res) =>
  jobController.getJobsByCategory(req, res)
);

// Protected routes (auth required)
router.post("/jobs", authenticateToken, (req, res) =>
  jobController.createJob(req, res)
);
router.put("/jobs/:id", authenticateToken, (req, res) =>
  jobController.updateJob(req, res)
);
router.delete("/jobs/:id", authenticateToken, (req, res) =>
  jobController.deleteJob(req, res)
);
router.get("/my-jobs", authenticateToken, (req, res) =>
  jobController.getMyJobs(req, res)
);

export default router;
