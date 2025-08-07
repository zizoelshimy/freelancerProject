import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { JobService } from "../../services/job.service";
import { AuthService } from "../../services/auth.service";
import { Job, JobProposal, ProposalStatus } from "../../models/job.model";

@Component({
  selector: "app-job-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: "./job-detail.component.html",
  styleUrl: "./job-detail.component.scss",
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  job = signal<Job | null>(null);
  proposals = signal<JobProposal[]>([]);
  currentUser = this.authService.currentUser;
  showProposalForm = signal(false);
  loading = signal(false);

  proposalForm = this.fb.group({
    rate: [0, [Validators.required, Validators.min(1)]],
    deliveryTime: [1, [Validators.required, Validators.min(1)]],
    coverLetter: ["", [Validators.required, Validators.minLength(50)]],
  });

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get("id");
    if (jobId) {
      this.loading.set(true);

      // Load job details
      this.jobService.getJobById(jobId).subscribe({
        next: (job) => {
          this.job.set(job);
          this.loading.set(false);
        },
        error: (error) => {
          console.error("Error loading job:", error);
          this.loading.set(false);
        },
      });

      // Load proposals for this job
      this.jobService.getProposalsForJob(jobId).subscribe({
        next: (proposals) => {
          this.proposals.set(proposals);
        },
        error: (error) => {
          console.error("Error loading proposals:", error);
        },
      });
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

      this.jobService
        .submitProposal({
          jobId: currentJob.id,
          rate: formData.rate!,
          deliveryTime: formData.deliveryTime!,
          coverLetter: formData.coverLetter!,
        })
        .subscribe({
          next: (response) => {
            // Reload proposals to show the new one
            this.jobService.getProposalsForJob(currentJob.id).subscribe({
              next: (proposals) => {
                this.proposals.set(proposals);
              },
            });

            this.proposalForm.reset();
            this.showProposalForm.set(false);
            alert("Proposal submitted successfully!");
          },
          error: (error) => {
            console.error("Error submitting proposal:", error);
            alert("Error submitting proposal. Please try again.");
          },
        });
    }
  }

  acceptProposal(proposalId: string): void {
    const currentJob = this.job();
    if (currentJob) {
      this.jobService.acceptProposal(proposalId).subscribe({
        next: (response) => {
          // Reload job and proposals to show updated status
          this.jobService.getJobById(currentJob.id).subscribe({
            next: (job) => {
              this.job.set(job);
            },
          });

          this.jobService.getProposalsForJob(currentJob.id).subscribe({
            next: (proposals) => {
              this.proposals.set(proposals);
            },
          });

          alert("Proposal accepted! The freelancer has been notified.");
        },
        error: (error) => {
          console.error("Error accepting proposal:", error);
          alert("Error accepting proposal. Please try again.");
        },
      });
    }
  }

  getCategoryIcon(category: string): string {
    const categoryMap: { [key: string]: string } = {
      "word-processing": "📝",
      "excel-data-entry": "📊",
      design: "🎨",
      typesetting: "📄",
    };
    return categoryMap[category] || "📋";
  }

  formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      "word-processing": "Word Processing",
      "excel-data-entry": "Excel & Data Entry",
      design: "Design",
      typesetting: "Typesetting",
    };
    return categoryMap[category] || category;
  }

  hasUserProposed(): boolean {
    const user = this.currentUser();
    const currentProposals = this.proposals();

    if (!user || !currentProposals) return false;

    return currentProposals.some(
      (proposal) => proposal.freelancerId === user.id
    );
  }

  isJobOwner(): boolean {
    const user = this.currentUser();
    const currentJob = this.job();

    if (!user || !currentJob) return false;

    return currentJob.clientId === user.id;
  }
}
