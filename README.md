## Authentication Flow

- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userPassword"
  }
  ```
- **Flow:**
  1. The controller receives the login request and extracts email and password.
  2. The use case looks up the user by email using the repository.
  3. If the user exists, the password is checked using `PasswordService.compare()`.
  4. If valid, a JWT token is generated and returned with the user's public info (no password).
  5. If authentication fails, a 401 error is returned.
- **Response Example:**
  ```json
  {
    "user": {
      "id": "...",
      "fullName": "...",
      "email": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "<JWT token>"
  }
  ```
- **Security:** Passwords are never exposed in responses. JWT tokens are used for session management and API authentication.

# Backend Architecture (Node.js, Express, MongoDB, Clean Architecture)

## Folder Structure

```
backend/
│
├── src/
│   ├── config/                # Configuration (environment variables, constants)
│   │   ├── index.ts           # Central export of all configs
│   │   └── database.ts        # Database configuration
│   │
│   ├── domain/                # Enterprise business rules
│   │   ├── entities/          # Business models (User, Job, Proposal)
│   │   ├── interfaces/        # Repository interfaces and domain interfaces
│   │   └── value-objects/     # Reusable domain value objects (e.g., Address)
│   │
│   ├── application/           # Application business rules
│   │   ├── use-cases/         # Application use cases/services
│   │   ├── dtos/              # Data Transfer Objects for input/output
│   │   ├── mappers/           # Map between domain entities and DTOs
│   │   └── interfaces/        # Service interfaces
│   │
│   ├── infrastructure/        # Frameworks & drivers
│   │   ├── database/
│   │   │   ├── mongodb/
│   │   │   │   ├── models/    # MongoDB schemas
│   │   │   │   └── connection.ts  # MongoDB connection
│   │   ├── repositories/      # Repository implementations
│   │   ├── security/          # Authentication/authorization logic
│   │   └── services/          # External service implementations
│   │
│   ├── interfaces/            # Interface adapters
│   │   ├── http/
│   │   │   ├── controllers/   # Express controllers
│   │   │   ├── routes/        # Express routes
│   │   │   ├── middlewares/   # Express middlewares
│   │   │   └── validators/    # Request validation
│   │   │
│   │   └── websockets/        # WebSocket interfaces if needed
│   │
│   └── server.ts              # Application entry point
│
├── tests/                     # Tests mirror the src structure
├── package.json
├── tsconfig.json
└── .env
```

## Clean Architecture & SOLID Principles

- **Domain Layer**: Pure business logic, entities, and interfaces. No dependencies on Express or MongoDB.
- **Application Layer**: Use cases, DTOs, and business workflows. Coordinates domain logic.
- **Infrastructure Layer**: Implements interfaces from the domain layer (e.g., MongoDB repositories, external services).
- **Interface Layer**: Express controllers, routes, and adapters. Only interacts with the application layer.

## Password Handling & Security

- User passwords are never stored in plain text. The `PasswordService` in `infrastructure/security/password.service.ts` is used to hash passwords before saving them to the database, and to compare hashes during authentication.
- When creating or updating a user (e.g., via Postman), you send the password in the request body, but the password will never appear in the API response.
- The `UserResponseDTO` excludes the password field, so user data returned from the API is always safe for the client.

**Best Practices:**

- Always hash passwords before saving to the database.
- Never expose password hashes or plain passwords in API responses.

**SOLID Principles:**

- Single Responsibility: Each class/module has one responsibility.
- Open/Closed: Extend, don’t modify, existing code.
- Liskov Substitution: Use interfaces for repositories/services.
- Interface Segregation: Keep interfaces small and focused.
- Dependency Inversion: High-level modules depend on abstractions, not concrete implementations.

This structure enforces the dependency rule of Clean Architecture: outer layers can depend on inner layers, but inner layers never depend on outer layers, ensuring your core business logic remains isolated and testable.
