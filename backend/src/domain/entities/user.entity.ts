// Domain entity - pure business logic without framework dependencies
export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
