import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, WorkExperience, PortfolioItem } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  activeTab = signal('overview');

  profileForm = this.fb.group({
    fullName: [this.currentUser()?.fullName || '', [Validators.required]],
    bio: [this.currentUser()?.bio || ''],
    skills: [this.currentUser()?.skills.join(', ') || '']
  });

  experienceForm = this.fb.group({
    title: ['', [Validators.required]],
    company: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    description: [''],
    current: [false]
  });

  portfolioForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: ['', [Validators.required]],
    fileUrl: ['']
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
        skills: formData.skills!.split(',').map(skill => skill.trim()).filter(Boolean)
      };
      
      this.authService.updateUser(updatedData);
      alert('Profile updated successfully!');
    }
  }

  addExperience(): void {
    if (this.experienceForm.valid) {
      const formData = this.experienceForm.value;
      const newExperience: WorkExperience = {
        id: Date.now().toString(),
        title: formData.title!,
        company: formData.company!,
        startDate: new Date(formData.startDate!),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        description: formData.description || '',
        current: formData.current || false
      };

      const currentUser = this.currentUser();
      if (currentUser) {
        const updatedExperience = [...currentUser.experience, newExperience];
        this.authService.updateUser({ experience: updatedExperience });
        this.experienceForm.reset();
        alert('Experience added successfully!');
      }
    }
  }

  addPortfolioItem(): void {
    if (this.portfolioForm.valid) {
      const formData = this.portfolioForm.value;
      const newPortfolioItem: PortfolioItem = {
        id: Date.now().toString(),
        title: formData.title!,
        description: formData.description!,
        category: formData.category!,
        fileUrl: formData.fileUrl,
        createdAt: new Date()
      };

      const currentUser = this.currentUser();
      if (currentUser) {
        const updatedPortfolio = [...currentUser.portfolio, newPortfolioItem];
        this.authService.updateUser({ portfolio: updatedPortfolio });
        this.portfolioForm.reset();
        alert('Portfolio item added successfully!');
      }
    }
  }

  removeExperience(id: string): void {
    const currentUser = this.currentUser();
    if (currentUser) {
      const updatedExperience = currentUser.experience.filter(exp => exp.id !== id);
      this.authService.updateUser({ experience: updatedExperience });
    }
  }

  removePortfolioItem(id: string): void {
    const currentUser = this.currentUser();
    if (currentUser) {
      const updatedPortfolio = currentUser.portfolio.filter(item => item.id !== id);
      this.authService.updateUser({ portfolio: updatedPortfolio });
    }
  }
}