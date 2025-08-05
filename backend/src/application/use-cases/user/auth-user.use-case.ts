import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import { UserAuthDTO, UserResponseDTO } from "../../dtos/user.dto";
import { UserMapper } from "../../mappers/user.mapper";
import { PasswordService } from "../../../infrastructure/security/password.service";
import jwt from "jsonwebtoken";

export class AuthUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    authDTO: UserAuthDTO
  ): Promise<{ user: UserResponseDTO; token: string }> {
    const user = await this.userRepository.findByEmail(authDTO.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await PasswordService.compare(
      authDTO.password,
      user.password
    );
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    return { user: UserMapper.toDTO(user), token };
  }
}
