import { User } from "../../domain/entities/user.entity";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from "../dtos/user.dto";

// Mapper to convert between domain entities and DTOs
export class UserMapper {
  // Convert domain entity to response DTO
  static toDTO(user: User): UserResponseDTO {
    return {
      id: user.id || "",
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt?.toISOString() || "",
      updatedAt: user.updatedAt?.toISOString() || "",
    };
  }

  // Convert create DTO to domain entity
  static toEntity(createUserDTO: CreateUserDTO): User {
    return {
      fullName: createUserDTO.fullName,
      email: createUserDTO.email,
      password: createUserDTO.password,
    };
  }

  // Convert update DTO to domain entity
  static toPartialEntity(updateUserDTO: UpdateUserDTO): Partial<User> {
    const entity: Partial<User> = {};
    if (updateUserDTO.fullName !== undefined)
      entity.fullName = updateUserDTO.fullName;
    if (updateUserDTO.email !== undefined) entity.email = updateUserDTO.email;
    if (updateUserDTO.password !== undefined)
      entity.password = updateUserDTO.password;
    return entity;
  }
}
