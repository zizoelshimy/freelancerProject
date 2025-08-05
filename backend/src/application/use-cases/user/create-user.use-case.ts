import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from "../../dtos/user.dto";
import { UserMapper } from "../../mappers/user.mapper";
import { User } from "../../../domain/entities/user.entity";

// Application use case for creating a user
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDTO: CreateUserDTO): Promise<UserResponseDTO> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDTO.email
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Convert DTO to entity
    const userEntity = UserMapper.toEntity(createUserDTO);

    // Store user
    const createdUser = await this.userRepository.create(userEntity);

    // Return response DTO
    return UserMapper.toDTO(createdUser);
  }
}
