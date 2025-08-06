import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:5000/api"; // Back to absolute URL
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const parsedUser = JSON.parse(userData);

      // Convert string dates back to Date objects and ensure all required fields exist
      const user: User = {
        ...parsedUser,
        createdAt: parsedUser.createdAt
          ? new Date(parsedUser.createdAt)
          : new Date(),
        skills: parsedUser.skills || [],
        experience: parsedUser.experience || [],
        portfolio: parsedUser.portfolio || [],
        rating: parsedUser.rating || 0,
        completedJobs: parsedUser.completedJobs || 0,
      };

      this.currentUserSignal.set(user);
    }
  }

  register(data: {
    fullName: string;
    email: string;
    password: string;
  }): Observable<any> {
    console.log("AuthService.register called with:", data);
    console.log("Making request to:", `${this.apiUrl}/users`);

    return this.http.post(`${this.apiUrl}/users`, data).pipe(
      tap((response) => console.log("AuthService register success:", response)),
      catchError((error) => {
        console.error("AuthService register error:", error);
        return throwError(() => error);
      })
    );
  }

  testConnection(): Observable<any> {
    console.log("Testing connection to:", `${this.apiUrl}/health`);
    return this.http.get(`${this.apiUrl}/health`).pipe(
      tap((response) => console.log("Connection test success:", response)),
      catchError((error) => {
        console.error("Connection test error:", error);
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<any>;
  login(data: { email: string; password: string }): Observable<any>;
  login(
    emailOrData: string | { email: string; password: string },
    password?: string
  ): Observable<any> {
    if (typeof emailOrData === "string") {
      return this.http.post(`${this.apiUrl}/auth/login`, {
        email: emailOrData,
        password: password!,
      });
    } else {
      return this.http.post(`${this.apiUrl}/auth/login`, emailOrData);
    }
  }

  // JWT Token Handling
  saveToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  removeToken(): void {
    localStorage.removeItem("authToken");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // User state management
  setCurrentUser(user: any, token: string): void {
    // Ensure the user object has all required fields for the frontend User model
    const completeUser: User = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: new Date(user.createdAt),
      skills: user.skills || [],
      experience: user.experience || [],
      portfolio: user.portfolio || [],
      rating: user.rating || 0,
      completedJobs: user.completedJobs || 0,
      bio: user.bio || "",
    };

    this.currentUserSignal.set(completeUser);
    localStorage.setItem("currentUser", JSON.stringify(completeUser));
    this.saveToken(token);
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem("currentUser");
    this.removeToken();
  }

  updateUser(userData: Partial<User>): void {
    const currentUser = this.currentUserSignal();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.currentUserSignal.set(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  }
}
