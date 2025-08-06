import { Request, Response } from "express";
import {
  AddExperienceUseCase,
  AddPortfolioItemUseCase,
  RemoveExperienceUseCase,
  RemovePortfolioItemUseCase,
  UpdateProfileUseCase,
} from "../../../application/use-cases/user/profile-operations.use-case";
import { MongoUserRepository } from "../../../infrastructure/repositories/user.repository";

// Update user profile (bio, skills, etc)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const profileData = req.body;

    // Use repository pattern and use case
    const userRepository = new MongoUserRepository();
    const updateProfileUseCase = new UpdateProfileUseCase(userRepository);

    const updatedUser = await updateProfileUseCase.execute(userId, profileData);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Add experience to user profile
export const addExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const experienceData = req.body;

    // Use repository pattern and use case
    const userRepository = new MongoUserRepository();
    const addExperienceUseCase = new AddExperienceUseCase(userRepository);

    const updatedUser = await addExperienceUseCase.execute(
      userId,
      experienceData
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Remove experience from user profile
export const removeExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const experienceId = req.params.experienceId;

    // Use repository pattern and use case
    const userRepository = new MongoUserRepository();
    const removeExperienceUseCase = new RemoveExperienceUseCase(userRepository);

    const updatedUser = await removeExperienceUseCase.execute(
      userId,
      experienceId
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Add portfolio item to user profile
export const addPortfolioItem = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const portfolioData = req.body;

    // Use repository pattern and use case
    const userRepository = new MongoUserRepository();
    const addPortfolioItemUseCase = new AddPortfolioItemUseCase(userRepository);

    const updatedUser = await addPortfolioItemUseCase.execute(
      userId,
      portfolioData
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Remove portfolio item from user profile
export const removePortfolioItem = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const portfolioItemId = req.params.portfolioItemId;

    // Use repository pattern and use case
    const userRepository = new MongoUserRepository();
    const removePortfolioItemUseCase = new RemovePortfolioItemUseCase(
      userRepository
    );

    const updatedUser = await removePortfolioItemUseCase.execute(
      userId,
      portfolioItemId
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
