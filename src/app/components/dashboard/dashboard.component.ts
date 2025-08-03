import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { Job, JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private jobService = inject(JobService);

  currentUser = this.authService.currentUser;
  allJobs = this.jobService.jobs;

  myJobs = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    
    return this.allJobs().filter(job => job.clientId === user.id);
  });

  myProposals = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    
    return this.allJobs().filter(job => 
      job.proposals.some(proposal => proposal.freelancerId === user.id)
    ).map(job => ({
      job,
      proposal: job.proposals.find(proposal => proposal.freelancerId === user.id)!
    }));
  });

  acceptedJobs = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    
    return this.allJobs().filter(job => 
      job.status === JobStatus.IN_PROGRESS && 
      job.proposals.some(proposal => 
        proposal.freelancerId === user.id && proposal.status === 'accepted'
      )
    );
  });

  stats = computed(() => {
    const user = this.currentUser();
    if (!user) return { totalJobs: 0, activeProposals: 0, acceptedJobs: 0, earnings: 0 };

    const myJobsCount = this.myJobs().length;
    const activeProposalsCount = this.myProposals().filter(p => p.proposal.status === 'pending').length;
    const acceptedJobsCount = this.acceptedJobs().length;
    const earnings = this.myProposals()
      .filter(p => p.proposal.status === 'accepted')
      .reduce((sum, p) => sum + p.proposal.proposedAmount, 0);

    return {
      totalJobs: myJobsCount,
      activeProposals: activeProposalsCount,
      acceptedJobs: acceptedJobsCount,
      earnings
    };
  });

  getJobStatusClass(status: JobStatus): string {
    const statusMap = {
      [JobStatus.OPEN]: 'open',
      [JobStatus.IN_PROGRESS]: 'in-progress',
      [JobStatus.COMPLETED]: 'completed',
      [JobStatus.CANCELLED]: 'cancelled'
    };
    return statusMap[status] || 'open';
  }

  getProposalStatusClass(status: string): string {
    return status.toLowerCase();
  }

  formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'word-processing': 'Word Processing',
      'excel-data-entry': 'Excel & Data Entry',
      'design': 'Design',
      'typesetting': 'Typesetting'
    };
    return categoryMap[category] || category;
  }
}