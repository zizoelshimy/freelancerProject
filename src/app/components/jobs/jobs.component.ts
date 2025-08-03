import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job, JobCategory, JobStatus } from '../../models/job.model';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  jobs = this.jobService.jobs;
  currentUser = this.authService.currentUser;
  selectedCategory = signal<JobCategory | 'all'>('all');
  showJobForm = signal(false);

  jobForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    budget: [0, [Validators.required, Validators.min(1)]],
    deadline: ['', [Validators.required]],
    requirements: ['']
  });

  categories = [
    { value: 'all', label: 'All Jobs', icon: '📋' },
    { value: JobCategory.WORD_PROCESSING, label: 'Word Processing', icon: '📝' },
    { value: JobCategory.EXCEL_DATA_ENTRY, label: 'Excel & Data Entry', icon: '📊' },
    { value: JobCategory.DESIGN, label: 'Design', icon: '🎨' },
    { value: JobCategory.TYPESETTING, label: 'Typesetting', icon: '📄' }
  ];

  get filteredJobs(): Job[] {
    const allJobs = this.jobs();
    if (this.selectedCategory() === 'all') {
      return allJobs.filter(job => job.status === JobStatus.OPEN);
    }
    return allJobs.filter(job => 
      job.category === this.selectedCategory() && job.status === JobStatus.OPEN
    );
  }

  filterByCategory(category: JobCategory | 'all'): void {
    this.selectedCategory.set(category);
  }

  toggleJobForm(): void {
    this.showJobForm.set(!this.showJobForm());
    if (!this.showJobForm()) {
      this.jobForm.reset();
    }
  }

  createJob(): void {
    if (this.jobForm.valid && this.currentUser()) {
      const formData = this.jobForm.value;
      const newJob = {
        title: formData.title!,
        description: formData.description!,
        category: formData.category as JobCategory,
        budget: formData.budget!,
        deadline: new Date(formData.deadline!),
        status: JobStatus.OPEN,
        requirements: formData.requirements!.split(',').map(req => req.trim()).filter(Boolean),
        clientId: this.currentUser()!.id,
        clientName: this.currentUser()!.fullName
      };

      this.jobService.createJob(newJob);
      this.jobForm.reset();
      this.showJobForm.set(false);
      alert('Job posted successfully!');
    }
  }

  getCategoryIcon(category: JobCategory): string {
    const categoryMap = {
      [JobCategory.WORD_PROCESSING]: '📝',
      [JobCategory.EXCEL_DATA_ENTRY]: '📊',
      [JobCategory.DESIGN]: '🎨',
      [JobCategory.TYPESETTING]: '📄'
    };
    return categoryMap[category] || '📋';
  }

  formatCategory(category: JobCategory): string {
    const categoryMap = {
      [JobCategory.WORD_PROCESSING]: 'Word Processing',
      [JobCategory.EXCEL_DATA_ENTRY]: 'Excel & Data Entry',
      [JobCategory.DESIGN]: 'Design',
      [JobCategory.TYPESETTING]: 'Typesetting'
    };
    return categoryMap[category] || category;
  }
}