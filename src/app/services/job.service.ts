import { Injectable, signal } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import {
  Job,
  JobCategory,
  JobStatus,
  JobProposal,
  ProposalStatus,
} from "../models/job.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class JobService {
  private apiUrl = "http://localhost:5000/api";
  private jobsSignal = signal<Job[]>([]);
  public jobs = this.jobsSignal.asReadonly();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadJobs().subscribe();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    });
  }

  private mapBackendJobToFrontend(backendJob: any): Job {
    return {
      id: backendJob.id,
      title: backendJob.title,
      description: backendJob.description,
      category: backendJob.category as JobCategory,
      budget: backendJob.budget,
      deadline: new Date(backendJob.deadline),
      status: backendJob.status as JobStatus,
      requirements: backendJob.requirements || [],
      clientId: backendJob.clientId,
      clientName: backendJob.clientName,
      proposals: [], // Proposals loaded separately
      acceptedProposal: backendJob.selectedProposal,
      createdAt: new Date(backendJob.createdAt),
    };
  }

  loadJobs(): Observable<Job[]> {
    return this.http.get<any>(`${this.apiUrl}/jobs`).pipe(
      map((response) => {
        // Handle both wrapped and unwrapped responses
        const jobs = response.data || response;
        return jobs.map((job: any) => this.mapBackendJobToFrontend(job));
      }),
      tap((jobs) => {
        this.jobsSignal.set(jobs);
        console.log("Jobs loaded:", jobs);
      }),
      catchError((error) => {
        console.error("Error loading jobs:", error);
        return throwError(() => error);
      })
    );
  }

  refreshJobs(): void {
    this.loadJobs().subscribe({
      next: () => console.log("Jobs refreshed"),
      error: (error) => console.error("Error refreshing jobs:", error),
    });
  }

  getJobById(id: string): Observable<Job> {
    return this.http.get<any>(`${this.apiUrl}/jobs/${id}`).pipe(
      map((response) => {
        // Handle both wrapped and unwrapped responses
        const job = response.data || response;
        return this.mapBackendJobToFrontend(job);
      }),
      catchError((error) => {
        console.error("Error getting job by ID:", error);
        return throwError(() => error);
      })
    );
  }

  getJobsByCategory(category: JobCategory): Observable<Job[]> {
    const categoryParam =
      category === JobCategory.WORD_PROCESSING
        ? "word-processing"
        : category === JobCategory.EXCEL_DATA_ENTRY
        ? "excel-data-entry"
        : category === JobCategory.DESIGN
        ? "design"
        : category === JobCategory.TYPESETTING
        ? "typesetting"
        : "all-jobs";

    return this.http
      .get<any>(`${this.apiUrl}/jobs/category/${categoryParam}`)
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          const jobs = response.data || response;
          return jobs.map((job: any) => this.mapBackendJobToFrontend(job));
        }),
        tap((jobs) => console.log(`Jobs for category ${category}:`, jobs)),
        catchError((error) => {
          console.error(`Error getting jobs by category ${category}:`, error);
          return throwError(() => error);
        })
      );
  }

  createJob(jobData: {
    title: string;
    description: string;
    category: JobCategory;
    budget: number;
    deadline: Date;
    requirements: string[];
  }): Observable<Job> {
    const payload = {
      ...jobData,
      deadline: jobData.deadline.toISOString(),
    };

    return this.http
      .post<any>(`${this.apiUrl}/jobs`, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          const job = response.data || response;
          return this.mapBackendJobToFrontend(job);
        }),
        tap((job) => {
          // Add the new job to the current jobs list and refresh jobs
          this.refreshJobs();
          console.log("Job created:", job);
        }),
        catchError((error) => {
          console.error("Error creating job:", error);
          return throwError(() => error);
        })
      );
  }

  getMyJobs(): Observable<Job[]> {
    return this.http
      .get<any>(`${this.apiUrl}/my-jobs`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          const jobs = response.data || response;
          return jobs.map((job: any) => this.mapBackendJobToFrontend(job));
        }),
        tap((jobs) => console.log("My jobs:", jobs)),
        catchError((error) => {
          console.error("Error getting my jobs:", error);
          return throwError(() => error);
        })
      );
  }

  // Proposal methods
  submitProposal(proposalData: {
    jobId: string;
    rate: number;
    deliveryTime: number;
    coverLetter: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/proposals`, proposalData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          return response.data || response;
        }),
        tap((response) => console.log("Proposal submitted:", response)),
        catchError((error) => {
          console.error("Error submitting proposal:", error);
          return throwError(() => error);
        })
      );
  }

  getProposalsForJob(jobId: string): Observable<JobProposal[]> {
    return this.http.get<any>(`${this.apiUrl}/proposals/job/${jobId}`).pipe(
      map((response) => {
        // Handle both wrapped and unwrapped responses
        const proposals = response.data || response;
        return proposals.map((p: any) => ({
          id: p.id,
          jobId: p.jobId,
          freelancerId: p.freelancerId,
          freelancerName: p.freelancerName,
          proposedAmount: p.rate,
          coverLetter: p.coverLetter,
          deliveryTime: p.deliveryTime,
          status: p.status as ProposalStatus,
          createdAt: new Date(p.submittedAt),
        }));
      }),
      tap((proposals) => console.log(`Proposals for job ${jobId}:`, proposals)),
      catchError((error) => {
        console.error("Error getting proposals for job:", error);
        return throwError(() => error);
      })
    );
  }

  getMyProposals(): Observable<JobProposal[]> {
    return this.http
      .get<any>(`${this.apiUrl}/my-proposals`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          const proposals = response.data || response;
          return proposals.map((p: any) => ({
            id: p.id,
            jobId: p.jobId,
            freelancerId: p.freelancerId,
            freelancerName: p.freelancerName,
            proposedAmount: p.rate,
            coverLetter: p.coverLetter,
            deliveryTime: p.deliveryTime,
            status: p.status as ProposalStatus,
            createdAt: new Date(p.submittedAt),
          }));
        }),
        tap((proposals) => console.log("My proposals:", proposals)),
        catchError((error) => {
          console.error("Error getting my proposals:", error);
          return throwError(() => error);
        })
      );
  }

  acceptProposal(proposalId: string): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/proposals/${proposalId}/accept`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          return response.data || response;
        }),
        tap((response) => console.log("Proposal accepted:", response)),
        catchError((error) => {
          console.error("Error accepting proposal:", error);
          return throwError(() => error);
        })
      );
  }

  updateProposal(
    proposalId: string,
    proposalData: {
      rate?: number;
      deliveryTime?: number;
      coverLetter?: string;
    }
  ): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/proposals/${proposalId}`, proposalData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          return response.data || response;
        }),
        tap((response) => console.log("Proposal updated:", response)),
        catchError((error) => {
          console.error("Error updating proposal:", error);
          return throwError(() => error);
        })
      );
  }

  withdrawProposal(proposalId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/proposals/${proposalId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          // Handle both wrapped and unwrapped responses
          return response.data || response;
        }),
        tap((response) => console.log("Proposal withdrawn:", response)),
        catchError((error) => {
          console.error("Error withdrawing proposal:", error);
          return throwError(() => error);
        })
      );
  }

  // Keep some of the original methods for backward compatibility
  getJobs(): Job[] {
    return this.jobsSignal();
  }

  getJobsByFilter(category?: JobCategory): Job[] {
    const allJobs = this.jobsSignal();
    if (!category || category === JobCategory.WORD_PROCESSING) {
      return allJobs;
    }
    return allJobs.filter((job) => job.category === category);
  }

  addProposal(jobId: string, proposal: JobProposal): void {
    const jobs = this.jobsSignal();
    const updatedJobs = jobs.map((job) => {
      if (job.id === jobId) {
        return {
          ...job,
          proposals: [...job.proposals, proposal],
        };
      }
      return job;
    });
    this.jobsSignal.set(updatedJobs);
  }
}
