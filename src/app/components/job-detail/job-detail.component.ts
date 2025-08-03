import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job, JobProposal } from '../../models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.scss'
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  job = signal<Job | null>(null);
  currentUser = this.authService.currentUser;
  showProposalForm = signal(false);

  proposalForm = this.fb.group({
    proposedAmount: [0, [Validators.required, Validators.min(1)]],
    deliveryTime: [1, [Validators.required, Validators.min(1)]],
    coverLetter: ['', [Validators.required, Validators.minLength(50)]]
  });

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      const foundJob = this.jobService.getJobById(jobId);
      this.job.set(foundJob || null);
    }
  }

  toggleProposalForm(): void {
    this.showProposalForm.set(!this.showProposalForm());
    if (!this.showProposalForm()) {
      this.proposalForm.reset();
    }
  }

  submitProposal(): void {
    const currentJob = this.job();
    const user = this.currentUser();
    
    if (this.proposalForm.valid && currentJob && user) {
      const formData = this.proposalForm.value;
      
      this.jobService.submitProposal({
        jobId: currentJob.id,
        freelancerId: user.id,
        freelancerName: user.fullName,
        proposedAmount: formData.proposedAmount!,
        deliveryTime: formData.deliveryTime!,
        coverLetter: formData.coverLetter!
      });

      // Update the local job data
      const updatedJob = this.jobService.getJobById(currentJob.id);
      this.job.set(updatedJob || null);
      
      this.proposalForm.reset();
      this.showProposalForm.set(false);
      alert('Proposal submitted successfully!');
    }
  }

  acceptProposal(proposalId: string): void {
    const currentJob = this.job();
    if (currentJob) {
      this.jobService.acceptProposal(currentJob.id, proposalId);
      
      // Update the local job data
      const updatedJob = this.jobService.getJobById(currentJob.id);
      this.job.set(updatedJob || null);
      
      alert('Proposal accepted! The freelancer has been notified.');
    }
  }

  getCategoryIcon(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'word-processing': '📝',
      'excel-data-entry': '📊',
      'design': '🎨',
      'typesetting': '📄'
    };
    return categoryMap[category] || '📋';
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

  hasUserProposed(): boolean {
    const user = this.currentUser();
    const currentJob = this.job();
    
    if (!user || !currentJob) return false;
    
    return currentJob.proposals.some(proposal => proposal.freelancerId === user.id);
  }

  isJobOwner(): boolean {
    const user = this.currentUser();
    const currentJob = this.job();
    
    if (!user || !currentJob) return false;
    
    return currentJob.clientId === user.id;
  }
}