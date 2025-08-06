// Domain entity - pure business logic without framework dependencies
export interface Experience {
  id?: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  current: boolean;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  createdAt: Date;
}

export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  experience?: Experience[];
  portfolio?: PortfolioItem[];
  rating?: number;
  completedJobs?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
