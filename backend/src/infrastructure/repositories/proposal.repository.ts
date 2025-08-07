import { ProposalRepository } from "../../domain/interfaces/repositories/proposal.repository";
import { Proposal } from "../../domain/entities/job.entity";
import ProposalModel from "../database/mongodb/models/proposal.model";

export class MongoProposalRepository implements ProposalRepository {
  async findAll(): Promise<Proposal[]> {
    try {
      const proposals = await ProposalModel.find().sort({ submittedAt: -1 });
      return proposals.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to fetch proposals: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findById(id: string): Promise<Proposal | null> {
    try {
      const proposal = await ProposalModel.findById(id);
      return proposal ? this.toDomainEntity(proposal) : null;
    } catch (error) {
      throw new Error(
        `Failed to find proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findByJobId(jobId: string): Promise<Proposal[]> {
    try {
      const proposals = await ProposalModel.find({ jobId }).sort({
        submittedAt: -1,
      });
      return proposals.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to find proposals by job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findByFreelancerId(freelancerId: string): Promise<Proposal[]> {
    try {
      const proposals = await ProposalModel.find({ freelancerId }).sort({
        submittedAt: -1,
      });
      return proposals.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to find proposals by freelancer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findByStatus(status: string): Promise<Proposal[]> {
    try {
      const proposals = await ProposalModel.find({ status }).sort({
        submittedAt: -1,
      });
      return proposals.map(this.toDomainEntity);
    } catch (error) {
      throw new Error(
        `Failed to find proposals by status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async create(proposal: Proposal): Promise<Proposal> {
    try {
      const newProposal = new ProposalModel(proposal);
      const savedProposal = await newProposal.save();
      return this.toDomainEntity(savedProposal);
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        throw new Error("You have already submitted a proposal for this job");
      }
      throw new Error(
        `Failed to create proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async update(
    id: string,
    proposalData: Partial<Proposal>
  ): Promise<Proposal | null> {
    try {
      const updatedProposal = await ProposalModel.findByIdAndUpdate(
        id,
        { ...proposalData, updatedAt: new Date() },
        { new: true }
      );
      return updatedProposal ? this.toDomainEntity(updatedProposal) : null;
    } catch (error) {
      throw new Error(
        `Failed to update proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await ProposalModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(
        `Failed to delete proposal: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private toDomainEntity(proposalDoc: any): Proposal {
    return {
      id: proposalDoc._id.toString(),
      jobId: proposalDoc.jobId,
      freelancerId: proposalDoc.freelancerId,
      freelancerName: proposalDoc.freelancerName,
      rate: proposalDoc.rate,
      deliveryTime: proposalDoc.deliveryTime,
      coverLetter: proposalDoc.coverLetter,
      status: proposalDoc.status,
      submittedAt: proposalDoc.submittedAt,
      updatedAt: proposalDoc.updatedAt,
    };
  }
}
