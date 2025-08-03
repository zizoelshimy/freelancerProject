import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.scss",
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLogin = signal(true);
  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  registerForm = this.fb.group({
    fullName: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    confirmPassword: ["", [Validators.required]],
  });

  toggleMode(): void {
    this.isLogin.set(!this.isLogin());
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).then(() => {
        this.isLoading.set(false);
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { password, confirmPassword } = this.registerForm.value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      this.isLoading.set(true);
      const { fullName, email } = this.registerForm.value;

      this.authService
        .register({
          email: email!,
          password: password!,
          fullName: fullName!,
        })
        .then(() => {
          this.isLoading.set(false);
        });
    }
  }

  loginWithGoogle(): void {
    // Simulate Google login
    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.login("user@gmail.com", "password").then(() => {
        this.isLoading.set(false);
      });
    }, 1500);
  }
}
