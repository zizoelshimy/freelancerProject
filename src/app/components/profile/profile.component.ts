import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { User, WorkExperience, PortfolioItem } from "../../models/user.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  activeTab = signal("overview");

  profileForm = this.fb.group({
    fullName: [this.currentUser()?.fullName || "", [Validators.required]],
    bio: [this.currentUser()?.bio || ""],
    skills: [this.currentUser()?.skills.join(", ") || ""],
  });

  experienceForm = this.fb.group({
    title: ["", [Validators.required]],
    company: ["", [Validators.required]],
    startDate: ["", [Validators.required]],
    endDate: [""],
    description: [""],
    current: [false],
  });

  portfolioForm = this.fb.group({
    title: ["", [Validators.required]],
    description: ["", [Validators.required]],
    category: ["", [Validators.required]],
    fileUrl: [""],
  });

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      const updatedData = {
        fullName: formData.fullName!,
        bio: formData.bio!,
        skills: formData
          .skills!.split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      this.authService.updateProfile(updatedData).subscribe({
        next: (response) => {
          alert("Profile updated successfully!");
        },
        error: (error) => {
          console.error("Error updating profile:", error);
          alert("Error updating profile. Please try again.");
        },
      });
    }
  }

  addExperience(): void {
    if (this.experienceForm.valid) {
      const formData = this.experienceForm.value;
      const experienceData = {
        title: formData.title!,
        company: formData.company!,
        startDate: formData.startDate!,
        endDate: formData.endDate || undefined,
        description: formData.description || "",
        current: formData.current || false,
      };

      this.authService.addExperience(experienceData).subscribe({
        next: (response) => {
          this.experienceForm.reset();
          alert("Experience added successfully!");
        },
        error: (error) => {
          console.error("Error adding experience:", error);
          alert("Error adding experience. Please try again.");
        },
      });
    }
  }

  addPortfolioItem(): void {
    if (this.portfolioForm.valid) {
      const formData = this.portfolioForm.value;
      const portfolioData = {
        title: formData.title!,
        description: formData.description!,
        category: formData.category!,
        fileUrl: formData.fileUrl || undefined,
      };

      this.authService.addPortfolioItem(portfolioData).subscribe({
        next: (response) => {
          this.portfolioForm.reset();
          alert("Portfolio item added successfully!");
        },
        error: (error) => {
          console.error("Error adding portfolio item:", error);
          alert("Error adding portfolio item. Please try again.");
        },
      });
    }
  }

  removeExperience(id: string): void {
    this.authService.removeExperience(id).subscribe({
      next: (response) => {
        alert("Experience removed successfully!");
      },
      error: (error) => {
        console.error("Error removing experience:", error);
        alert("Error removing experience. Please try again.");
      },
    });
  }

  removePortfolioItem(id: string): void {
    this.authService.removePortfolioItem(id).subscribe({
      next: (response) => {
        alert("Portfolio item removed successfully!");
      },
      error: (error) => {
        console.error("Error removing portfolio item:", error);
        alert("Error removing portfolio item. Please try again.");
      },
    });
  }
}
