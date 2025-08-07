import { Router } from "express";
import { ProposalController } from "../controllers/proposal.controller";
import { MongoJobRepository } from "../../../infrastructure/repositories/job.repository";
import { MongoProposalRepository } from "../../../infrastructure/repositories/proposal.repository";
import {
  CreateProposalUseCase,
  GetProposalsByJobUseCase,
  GetProposalsByFreelancerUseCase,
  UpdateProposalUseCase,
  AcceptProposalUseCase,
  WithdrawProposalUseCase,
} from "../../../application/use-cases/job/proposal-operations.use-case";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Initialize repositories
const jobRepository = new MongoJobRepository();
const proposalRepository = new MongoProposalRepository();

// Initialize use cases
const createProposalUseCase = new CreateProposalUseCase(
  proposalRepository,
  jobRepository
);
const getProposalsByJobUseCase = new GetProposalsByJobUseCase(
  proposalRepository
);
const getProposalsByFreelancerUseCase = new GetProposalsByFreelancerUseCase(
  proposalRepository
);
const updateProposalUseCase = new UpdateProposalUseCase(proposalRepository);
const acceptProposalUseCase = new AcceptProposalUseCase(
  proposalRepository,
  jobRepository
);
const withdrawProposalUseCase = new WithdrawProposalUseCase(
  proposalRepository,
  jobRepository
);

// Initialize controller
const proposalController = new ProposalController(
  createProposalUseCase,
  getProposalsByJobUseCase,
  getProposalsByFreelancerUseCase,
  updateProposalUseCase,
  acceptProposalUseCase,
  withdrawProposalUseCase
);

// Public routes (no auth required for reading proposals by job)
router.get("/proposals/job/:jobId", (req, res) =>
  proposalController.getProposalsByJob(req, res)
);

// Protected routes (auth required)
router.post("/proposals", authenticateToken, (req, res) =>
  proposalController.createProposal(req, res)
);
router.get("/my-proposals", authenticateToken, (req, res) =>
  proposalController.getMyProposals(req, res)
);
router.put("/proposals/:id", authenticateToken, (req, res) =>
  proposalController.updateProposal(req, res)
);
router.post("/proposals/:id/accept", authenticateToken, (req, res) =>
  proposalController.acceptProposal(req, res)
);
router.delete("/proposals/:id", authenticateToken, (req, res) =>
  proposalController.withdrawProposal(req, res)
);

export default router;
