export interface User {
  id: string;
  email: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  skills: string[];
  experience: WorkExperience[];
  portfolio: PortfolioItem[];
  rating: number;
  completedJobs: number;
  createdAt: Date;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  current: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  fileUrl?: string;
  category: string;
  createdAt: Date;
}