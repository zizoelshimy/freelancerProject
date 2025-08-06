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
    password: [
      "",
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/
        ),
      ],
    ],
    confirmPassword: ["", [Validators.required]],
  });

  get isRegisterFormValid(): boolean {
    return (
      this.registerForm.valid &&
      this.registerForm.get("password")?.value ===
        this.registerForm.get("confirmPassword")?.value
    );
  }

  toggleMode(): void {
    this.isLogin.set(!this.isLogin());
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;

      console.log("Login attempt with:", { email, password: "***" });

      this.authService.login(email!, password!).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log("Login successful:", response);
          if (response.token) {
            this.authService.setCurrentUser(response.user, response.token);
            alert("Login successful!");
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error("Login failed - Full error object:", error);
          console.error("Error status:", error.status);
          console.error("Error message:", error.message);
          console.error("Error error:", error.error);

          // Display specific error messages
          if (error.error && error.error.message) {
            alert(`Login failed: ${error.error.message}`);
          } else if (error.status === 404) {
            alert(
              "Login failed: Authentication endpoint not found. Please check if the backend server is running."
            );
          } else if (error.status === 401) {
            alert("Login failed: Invalid email or password.");
          } else if (error.status === 0) {
            alert(
              "Connection failed. Please check if the backend server is running."
            );
          } else {
            alert(`Login failed. Status: ${error.status}. Please try again.`);
          }
        },
      });
    } else {
      alert("Please enter valid email and password.");
    }
  }

  onRegister(): void {
    console.log("Register button clicked");
    console.log("Form valid:", this.registerForm.valid);
    console.log("Form values:", this.registerForm.value);
    console.log("Form errors:", this.getFormErrors());

    if (this.registerForm.valid) {
      const { fullName, email, password, confirmPassword } =
        this.registerForm.value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const requestData = {
        email: email!,
        password: password!,
        fullName: fullName!,
      };

      console.log("Sending request to backend:", requestData);
      this.isLoading.set(true);

      this.authService.register(requestData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          console.log("Registration successful response:", response);
          alert("Registration successful!");
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error("Registration failed - Full error object:", error);
          console.error("Error status:", error.status);
          console.error("Error message:", error.message);
          console.error("Error error:", error.error);

          // Display specific error messages
          if (error.error && error.error.errors) {
            const errorMessages = error.error.errors
              .map((err: any) => err.msg)
              .join("\n");
            alert(`Registration failed:\n${errorMessages}`);
          } else if (error.error && error.error.error) {
            alert(`Registration failed: ${error.error.error}`);
          } else if (error.status === 0) {
            alert(
              "Connection failed. Please check if the backend server is running."
            );
          } else {
            alert(
              `Registration failed. Status: ${error.status}. Please check your details or try again later.`
            );
          }
        },
      });
    } else {
      console.log("Form is invalid");
      const errors = this.getFormErrors();
      const errorMessages = Object.keys(errors)
        .map((field) => `${field}: ${errors[field].join(", ")}`)
        .join("\n");
      alert(`Please fix the following errors:\n${errorMessages}`);
    }
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      if (control && !control.valid && control.errors) {
        errors[key] = [];
        if (control.errors["required"]) {
          errors[key].push("This field is required");
        }
        if (control.errors["email"]) {
          errors[key].push("Please enter a valid email");
        }
        if (control.errors["minlength"]) {
          errors[key].push(
            `Minimum length is ${control.errors["minlength"].requiredLength}`
          );
        }
        if (control.errors["pattern"] && key === "password") {
          errors[key].push(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
          );
        }
      }
    });
    return errors;
  }

  loginWithGoogle(): void {
    // Simulate Google login
    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.login("user@gmail.com", "password").subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.token) {
            this.authService.setCurrentUser(response.user, response.token);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error("Google login failed:", error);
        },
      });
    }, 1500);
  }

  testBackendConnection(): void {
    console.log("Testing backend connection...");
    this.authService.testConnection().subscribe({
      next: (response) => {
        console.log("Backend connection test successful:", response);
        alert("Backend connection successful!");
      },
      error: (error) => {
        console.error("Backend connection test failed:", error);
        alert("Backend connection failed: " + JSON.stringify(error));
      },
    });
  }
}
