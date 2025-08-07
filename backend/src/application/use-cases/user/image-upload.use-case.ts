import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import {
  deleteProfileImage,
  getImageUrl,
} from "../../../infrastructure/services/image-upload.service";

export class UploadProfileImageUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, filename: string): Promise<any> {
    try {
      // Get current user to delete old image if exists
      const currentUser = await this.userRepository.findById(userId);
      if (!currentUser) {
        throw new Error("User not found");
      }

      // Delete old profile image if exists
      if (currentUser.profileImage) {
        deleteProfileImage(currentUser.profileImage);
      }

      // Generate new image URL
      const imageUrl = getImageUrl(filename);

      // Update user with new profile image
      const updatedUser = await this.userRepository.update(userId, {
        profileImage: imageUrl,
      });

      if (!updatedUser) {
        throw new Error("Failed to update user profile image");
      }

      return updatedUser;
    } catch (error) {
      throw new Error(
        `Failed to upload profile image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export class DeleteProfileImageUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<any> {
    try {
      // Get current user
      const currentUser = await this.userRepository.findById(userId);
      if (!currentUser) {
        throw new Error("User not found");
      }

      // Delete profile image file if exists
      if (currentUser.profileImage) {
        deleteProfileImage(currentUser.profileImage);
      }

      // Update user to remove profile image
      const updatedUser = await this.userRepository.update(userId, {
        profileImage: undefined,
      });

      if (!updatedUser) {
        throw new Error("Failed to update user profile");
      }

      return updatedUser;
    } catch (error) {
      throw new Error(
        `Failed to delete profile image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
