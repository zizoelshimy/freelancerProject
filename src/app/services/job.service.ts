import { Injectable, signal } from '@angular/core';
import { Job, JobCategory, JobStatus, JobProposal, ProposalStatus } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsSignal = signal<Job[]>([]);
  public jobs = this.jobsSignal.asReadonly();

  constructor() {
    this.loadMockJobs();
  }

  private loadMockJobs(): void {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Data Entry for Customer Database',
        description: 'Need someone to enter 500 customer records from PDF files into Excel spreadsheet with proper formatting and validation.',
        category: JobCategory.EXCEL_DATA_ENTRY,
        budget: 150,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: JobStatus.OPEN,
        requirements: ['Excel proficiency', 'Attention to detail', 'Data validation experience'],
        clientId: 'client1',
        clientName: 'Sarah Johnson',
        proposals: [],
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Format Academic Research Paper',
        description: 'Format a 50-page research paper according to APA style guidelines. Includes citation formatting, table of contents, and bibliography.',
        category: JobCategory.WORD_PROCESSING,
        budget: 200,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: JobStatus.OPEN,
        requirements: ['Microsoft Word expertise', 'APA style knowledge', 'Academic formatting experience'],
        clientId: 'client2',
        clientName: 'Dr. Michael Chen',
        proposals: [],
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Create Social Media Post Designs',
        description: 'Design 10 Instagram posts for a fitness brand. Need modern, eye-catching designs that align with brand guidelines.',
        category: JobCategory.DESIGN,
        budget: 300,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: JobStatus.OPEN,
        requirements: ['Graphic design skills', 'Instagram design experience', 'Brand awareness'],
        clientId: 'client3',
        clientName: 'FitLife Studio',
        proposals: [],
        createdAt: new Date()
      }
    ];

    this.jobsSignal.set(mockJobs);
  }

  getJobs(): Job[] {
    return this.jobs();
  }

  getJobById(id: string): Job | undefined {
    return this.jobs().find(job => job.id === id);
  }

  getJobsByCategory(category: JobCategory): Job[] {
    return this.jobs().filter(job => job.category === category);
  }

  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'proposals'>): void {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      proposals: [],
      createdAt: new Date()
    };

    this.jobsSignal.update(jobs => [...jobs, newJob]);
  }

  submitProposal(proposal: Omit<JobProposal, 'id' | 'createdAt'>): void {
    const newProposal: JobProposal = {
      ...proposal,
      id: Date.now().toString(),
      status: ProposalStatus.PENDING,
      createdAt: new Date()
    };

    this.jobsSignal.update(jobs => 
      jobs.map(job => 
        job.id === proposal.jobId 
          ? { ...job, proposals: [...job.proposals, newProposal] }
          : job
      )
    );
  }

  acceptProposal(jobId: string, proposalId: string): void {
    this.jobsSignal.update(jobs =>
      jobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: JobStatus.IN_PROGRESS,
            acceptedProposal: proposalId,
            proposals: job.proposals.map(proposal => ({
              ...proposal,
              status: proposal.id === proposalId ? ProposalStatus.ACCEPTED : ProposalStatus.REJECTED
            }))
          };
        }
        return job;
      })
    );
  }
}