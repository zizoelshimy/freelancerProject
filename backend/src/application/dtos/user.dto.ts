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
  profileImage?: string;
  bio?: string;
  skills: string[];
  experience: {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
    current: boolean;
  }[];
  portfolio: {
    id: string;
    title: string;
    description: string;
    category: string;
    fileUrl?: string;
    createdAt: string;
  }[];
  rating: number;
  completedJobs: number;
}

// DTO for updating a user
export interface UpdateUserDTO {
  fullName?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
}

// DTO for authentication
export interface UserAuthDTO {
  email: string;
  password: string;
}

// DTO for adding experience
export interface AddExperienceDTO {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
  current?: boolean;
}

// DTO for adding portfolio item
export interface AddPortfolioItemDTO {
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
}
