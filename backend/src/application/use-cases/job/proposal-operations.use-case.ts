import { ProposalRepository } from "../../../domain/interfaces/repositories/proposal.repository";
import { JobRepository } from "../../../domain/interfaces/repositories/job.repository";
import {
  Proposal,
  ProposalStatus,
  JobStatus,
} from "../../../domain/entities/job.entity";

export class CreateProposalUseCase {
  constructor(
    private proposalRepository: ProposalRepository,
    private jobRepository: JobRepository
  ) {}

  async execute(
    proposalData: Omit<Proposal, "id" | "status" | "submittedAt" | "updatedAt">
  ): Promise<Proposal> {
    try {
      // Check if job exists and is still open
      const job = await this.jobRepository.findById(proposalData.jobId);
      if (!job) {
        throw new Error("Job not found");
      }

      if (job.status !== JobStatus.OPEN) {
        throw new Error("This job is no longer accepting proposals");
      }

      // Check if freelancer is trying to propose on their own job
      if (job.clientId === proposalData.freelancerId) {
        throw new Error("You cannot submit a proposal for your own job");
      }

      const newProposal: Proposal = {
        ...proposalData,
        status: ProposalStatus.PENDING,
      };

      const createdProposal = await this.proposalRepository.create(newProposal);

      // Add proposal ID to the job's proposals array
      await this.jobRepository.addProposal(
        proposalData.jobId,
        createdProposal.id!
      );

      return createdProposal;
    } catch (error) {
      throw new Error(
        `Failed to create proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class GetProposalsByJobUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute(jobId: string): Promise<Proposal[]> {
    try {
      return await this.proposalRepository.findByJobId(jobId);
    } catch (error) {
      throw new Error(
        `Failed to get proposals for job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class GetProposalsByFreelancerUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute(freelancerId: string): Promise<Proposal[]> {
    try {
      return await this.proposalRepository.findByFreelancerId(freelancerId);
    } catch (error) {
      throw new Error(
        `Failed to get proposals by freelancer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class UpdateProposalUseCase {
  constructor(private proposalRepository: ProposalRepository) {}

  async execute(
    id: string,
    proposalData: Partial<Proposal>,
    freelancerId: string
  ): Promise<Proposal | null> {
    try {
      // Check if proposal exists and belongs to the freelancer
      const proposal = await this.proposalRepository.findById(id);
      if (!proposal) {
        throw new Error("Proposal not found");
      }

      if (proposal.freelancerId !== freelancerId) {
        throw new Error("You can only update your own proposals");
      }

      if (proposal.status !== ProposalStatus.PENDING) {
        throw new Error("You can only update pending proposals");
      }

      return await this.proposalRepository.update(id, proposalData);
    } catch (error) {
      throw new Error(
        `Failed to update proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class AcceptProposalUseCase {
  constructor(
    private proposalRepository: ProposalRepository,
    private jobRepository: JobRepository
  ) {}

  async execute(
    proposalId: string,
    clientId: string
  ): Promise<Proposal | null> {
    try {
      // Get the proposal
      const proposal = await this.proposalRepository.findById(proposalId);
      if (!proposal) {
        throw new Error("Proposal not found");
      }

      // Check if the job belongs to the client
      const job = await this.jobRepository.findById(proposal.jobId);
      if (!job || job.clientId !== clientId) {
        throw new Error("You can only accept proposals for your own jobs");
      }

      // Update proposal status to accepted
      const updatedProposal = await this.proposalRepository.update(proposalId, {
        status: ProposalStatus.ACCEPTED,
      });

      // Update job with selected proposal and change status
      await this.jobRepository.update(proposal.jobId, {
        selectedProposal: proposalId,
        status: JobStatus.IN_PROGRESS,
      });

      // Reject all other proposals for this job
      const otherProposals = await this.proposalRepository.findByJobId(
        proposal.jobId
      );
      for (const otherProposal of otherProposals) {
        if (
          otherProposal.id !== proposalId &&
          otherProposal.status === ProposalStatus.PENDING
        ) {
          await this.proposalRepository.update(otherProposal.id!, {
            status: ProposalStatus.REJECTED,
          });
        }
      }

      return updatedProposal;
    } catch (error) {
      throw new Error(
        `Failed to accept proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class WithdrawProposalUseCase {
  constructor(
    private proposalRepository: ProposalRepository,
    private jobRepository: JobRepository
  ) {}

  async execute(proposalId: string, freelancerId: string): Promise<boolean> {
    try {
      // Check if proposal exists and belongs to the freelancer
      const proposal = await this.proposalRepository.findById(proposalId);
      if (!proposal) {
        throw new Error("Proposal not found");
      }

      if (proposal.freelancerId !== freelancerId) {
        throw new Error("You can only withdraw your own proposals");
      }

      if (proposal.status !== ProposalStatus.PENDING) {
        throw new Error("You can only withdraw pending proposals");
      }

      // Remove proposal from job's proposals array
      await this.jobRepository.removeProposal(proposal.jobId, proposalId);

      // Delete the proposal
      return await this.proposalRepository.delete(proposalId);
    } catch (error) {
      throw new Error(
        `Failed to withdraw proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
