import { Component, inject, signal, computed } from "@angular/core";
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
  selectedImageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  isUploading = signal(false);

  // Computed signal for profile image URL to ensure reactivity
  profileImageUrl = computed(() => {
    const user = this.currentUser();
    console.log("Current user in computed signal:", user);
    if (user?.profileImage) {
      // If it's a full URL, return as is, otherwise prepend the base URL
      const imageUrl = user.profileImage.startsWith("http")
        ? user.profileImage
        : `http://localhost:5000${user.profileImage}`;
      console.log("Profile image URL computed:", imageUrl);
      return imageUrl;
    }
    console.log("No profile image found, returning null");
    return null;
  });

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

  recentActivityForm = this.fb.group({
    activity: ["", [Validators.required]],
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

  addRecentActivity(): void {
    if (this.recentActivityForm.valid) {
      const formData = this.recentActivityForm.value;
      const activityData = {
        activity: formData.activity!,
      };

      this.authService.addRecentActivity(activityData).subscribe({
        next: (response) => {
          this.recentActivityForm.reset();
          alert("Recent activity added successfully!");
        },
        error: (error) => {
          console.error("Error adding recent activity:", error);
          alert("Error adding recent activity. Please try again.");
        },
      });
    }
  }

  removeRecentActivity(id: string): void {
    this.authService.removeRecentActivity(id).subscribe({
      next: (response) => {
        alert("Recent activity removed successfully!");
      },
      error: (error) => {
        console.error("Error removing recent activity:", error);
        alert("Error removing recent activity. Please try again.");
      },
    });
  }

  // Image upload methods
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB.");
        return;
      }

      this.selectedImageFile.set(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): void {
    const file = this.selectedImageFile();
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    this.isUploading.set(true);
    this.authService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.isUploading.set(false);
        this.selectedImageFile.set(null);
        this.imagePreview.set(null);
        console.log("Upload response:", response);
        console.log("Updated user:", this.currentUser());
        alert("Profile image uploaded successfully!");
      },
      error: (error) => {
        this.isUploading.set(false);
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      },
    });
  }

  deleteImage(): void {
    if (confirm("Are you sure you want to delete your profile image?")) {
      this.authService.deleteProfileImage().subscribe({
        next: (response) => {
          console.log("Delete response:", response);
          console.log("Updated user after delete:", this.currentUser());
          alert("Profile image deleted successfully!");
        },
        error: (error) => {
          console.error("Error deleting image:", error);
          alert("Error deleting image. Please try again.");
        },
      });
    }
  }

  cancelImageSelection(): void {
    this.selectedImageFile.set(null);
    this.imagePreview.set(null);
  }

  getProfileImageUrl(): string | null {
    const user = this.currentUser();
    if (user?.profileImage) {
      // If it's a full URL, return as is, otherwise prepend the base URL
      return user.profileImage.startsWith("http")
        ? user.profileImage
        : `http://localhost:5000${user.profileImage}`;
    }
    return null;
  }
}
