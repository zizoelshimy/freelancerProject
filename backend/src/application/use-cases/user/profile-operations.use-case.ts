import { UserRepository } from "../../../domain/interfaces/repositories/user.repository";
import {
  AddExperienceDTO,
  AddPortfolioItemDTO,
  UpdateUserDTO,
} from "../../dtos/user.dto";
import { UserMapper } from "../../mappers/user.mapper";

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, data: UpdateUserDTO) {
    const entity = UserMapper.toPartialEntity(data);
    const updatedUser = await this.userRepository.update(id, entity);
    if (!updatedUser) {
      throw new Error("User not found or update failed");
    }
    return UserMapper.toDTO(updatedUser);
  }
}

export class AddExperienceUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, experienceData: AddExperienceDTO) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const experience = {
      id: String(new Date().getTime()),
      title: experienceData.title,
      company: experienceData.company,
      startDate: new Date(experienceData.startDate),
      endDate: experienceData.endDate
        ? new Date(experienceData.endDate)
        : undefined,
      description: experienceData.description || "",
      current: experienceData.current || false,
    };

    // Add the new experience to user's experience array
    if (!user.experience) user.experience = [];
    user.experience.push(experience);

    // Update the user with the new experience
    const updatedUser = await this.userRepository.update(userId, {
      experience: user.experience,
    });
    if (!updatedUser) {
      throw new Error("Failed to update user experience");
    }
    return UserMapper.toDTO(updatedUser);
  }
}

export class RemoveExperienceUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, experienceId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.experience) {
      throw new Error("User or experience not found");
    }

    // Filter out the experience with the given ID
    const updatedExperience = user.experience.filter(
      (exp) => exp.id !== experienceId
    );

    // Update the user with the filtered experience array
    const updatedUser = await this.userRepository.update(userId, {
      experience: updatedExperience,
    });
    if (!updatedUser) {
      throw new Error("Failed to remove experience");
    }
    return UserMapper.toDTO(updatedUser);
  }
}

export class AddPortfolioItemUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, portfolioData: AddPortfolioItemDTO) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const portfolioItem = {
      id: String(new Date().getTime()),
      title: portfolioData.title,
      description: portfolioData.description,
      category: portfolioData.category,
      fileUrl: portfolioData.fileUrl,
      createdAt: new Date(),
    };

    // Add the new portfolio item to user's portfolio array
    if (!user.portfolio) user.portfolio = [];
    user.portfolio.push(portfolioItem);

    // Update the user with the new portfolio item
    const updatedUser = await this.userRepository.update(userId, {
      portfolio: user.portfolio,
    });
    if (!updatedUser) {
      throw new Error("Failed to add portfolio item");
    }
    return UserMapper.toDTO(updatedUser);
  }
}

export class RemovePortfolioItemUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, portfolioItemId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.portfolio) {
      throw new Error("User or portfolio item not found");
    }

    // Filter out the portfolio item with the given ID
    const updatedPortfolio = user.portfolio.filter(
      (item) => item.id !== portfolioItemId
    );

    // Update the user with the filtered portfolio array
    const updatedUser = await this.userRepository.update(userId, {
      portfolio: updatedPortfolio,
    });
    if (!updatedUser) {
      throw new Error("Failed to remove portfolio item");
    }
    return UserMapper.toDTO(updatedUser);
  }
}
