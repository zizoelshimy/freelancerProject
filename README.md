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

**SOLID Principles:**

- Single Responsibility: Each class/module has one responsibility.
- Open/Closed: Extend, don’t modify, existing code.
- Liskov Substitution: Use interfaces for repositories/services.
- Interface Segregation: Keep interfaces small and focused.
- Dependency Inversion: High-level modules depend on abstractions, not concrete implementations.

This structure enforces the dependency rule of Clean Architecture: outer layers can depend on inner layers, but inner layers never depend on outer layers, ensuring your core business logic remains isolated and testable.
