import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
import { MongoUserRepository } from "../../../infrastructure/repositories/user.repository";
import {
  CreateProposalUseCase,
  GetProposalsByJobUseCase,
  GetProposalsByFreelancerUseCase,
  UpdateProposalUseCase,
  AcceptProposalUseCase,
  WithdrawProposalUseCase,
} from "../../../application/use-cases/job/proposal-operations.use-case";

export class ProposalController {
  constructor(
    private createProposalUseCase: CreateProposalUseCase,
    private getProposalsByJobUseCase: GetProposalsByJobUseCase,
    private getProposalsByFreelancerUseCase: GetProposalsByFreelancerUseCase,
    private updateProposalUseCase: UpdateProposalUseCase,
    private acceptProposalUseCase: AcceptProposalUseCase,
    private withdrawProposalUseCase: WithdrawProposalUseCase
  ) {}

  async createProposal(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const proposalData = req.body;
      const freelancerId = req.user?.userId;

      if (!freelancerId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      // Get user details to fetch the freelancer name
      const userRepository = new MongoUserRepository();
      const user = await userRepository.findById(freelancerId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const proposal = await this.createProposalUseCase.execute({
        ...proposalData,
        freelancerId,
        freelancerName: user.fullName,
      });

      res.status(201).json({
        success: true,
        message: "Proposal submitted successfully",
        data: proposal,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create proposal",
      });
    }
  }

  async getProposalsByJob(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { jobId } = req.params;
      const proposals = await this.getProposalsByJobUseCase.execute(jobId);

      res.status(200).json({
        success: true,
        data: proposals,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve proposals",
      });
    }
  }

  async getMyProposals(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const freelancerId = req.user?.userId;

      if (!freelancerId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const proposals = await this.getProposalsByFreelancerUseCase.execute(
        freelancerId
      );

      res.status(200).json({
        success: true,
        data: proposals,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve your proposals",
      });
    }
  }

  async updateProposal(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const proposalData = req.body;
      const freelancerId = req.user?.userId;

      if (!freelancerId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const updatedProposal = await this.updateProposalUseCase.execute(
        id,
        proposalData,
        freelancerId
      );

      if (!updatedProposal) {
        res.status(404).json({
          success: false,
          error:
            "Proposal not found or you do not have permission to update this proposal",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Proposal updated successfully",
        data: updatedProposal,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update proposal",
      });
    }
  }

  async acceptProposal(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const clientId = req.user?.userId;

      if (!clientId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const acceptedProposal = await this.acceptProposalUseCase.execute(
        id,
        clientId
      );

      if (!acceptedProposal) {
        res.status(404).json({
          success: false,
          error:
            "Proposal not found or you do not have permission to accept this proposal",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Proposal accepted successfully",
        data: acceptedProposal,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to accept proposal",
      });
    }
  }

  async withdrawProposal(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const freelancerId = req.user?.userId;

      if (!freelancerId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const withdrawn = await this.withdrawProposalUseCase.execute(
        id,
        freelancerId
      );

      if (!withdrawn) {
        res.status(404).json({
          success: false,
          error:
            "Proposal not found or you do not have permission to withdraw this proposal",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Proposal withdrawn successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to withdraw proposal",
      });
    }
  }
}
