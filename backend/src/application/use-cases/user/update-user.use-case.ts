import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import { UpdateUserDTO, UserResponseDTO } from "../../dtos/user.dto";
import { UserMapper } from "../../mappers/user.mapper";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    updateUserDTO: UpdateUserDTO
  ): Promise<UserResponseDTO> {
    // Convert DTO to entity
    const updateData = UserMapper.toPartialEntity(updateUserDTO);

    // Update user
    const updatedUser = await this.userRepository.update(id, updateData);

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Return response DTO
    return UserMapper.toDTO(updatedUser);
  }
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);

    if (!result) {
      throw new Error("User not found");
    }

    return true;
  }
}
