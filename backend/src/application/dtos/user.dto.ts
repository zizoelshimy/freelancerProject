// All possible DTOs for User entity

// DTO for creating a user
export interface CreateUserDTO {
  fullName: string;
  email: string;
  password: string;
}

// DTO for user responses (excludes password)
export interface UserResponseDTO {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// DTO for updating a user
export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  password?: string;
}

// DTO for authentication
export interface UserAuthDTO {
  email: string;
  password: string;
}
