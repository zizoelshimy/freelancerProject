import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSignal.set(JSON.parse(userData));
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          email: email,
          fullName: 'John Doe',
          bio: 'Experienced freelancer specializing in data entry and Excel processing.',
          skills: ['Excel', 'Data Entry', 'Word Processing'],
          experience: [],
          portfolio: [],
          rating: 4.8,
          completedJobs: 25,
          createdAt: new Date()
        };
        
        this.currentUserSignal.set(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        this.router.navigate(['/dashboard']);
        resolve(true);
      }, 1000);
    });
  }

  register(userData: { email: string; password: string; fullName: string }): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const newUser: User = {
          id: Date.now().toString(),
          email: userData.email,
          fullName: userData.fullName,
          skills: [],
          experience: [],
          portfolio: [],
          rating: 0,
          completedJobs: 0,
          createdAt: new Date()
        };
        
        this.currentUserSignal.set(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.router.navigate(['/profile']);
        resolve(true);
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  updateUser(userData: Partial<User>): void {
    const currentUser = this.currentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.currentUserSignal.set(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }
}