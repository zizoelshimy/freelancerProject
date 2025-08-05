import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import { UserResponseDTO } from "../../dtos/user.dto";
import { UserMapper } from "../../mappers/user.mapper";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return UserMapper.toDTO(user);
  }
}

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserMapper.toDTO(user));
  }
}
