import { Router } from "express";
import {
  updateProfile,
  addExperience,
  removeExperience,
  addPortfolioItem,
  removePortfolioItem,
} from "../controllers/profile.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Apply authentication middleware to all profile routes
router.use(authenticateToken);

// Profile update routes
router.put("/:id", updateProfile);
router.post("/:id/experience", addExperience);
router.delete("/:userId/experience/:experienceId", removeExperience);
router.post("/:id/portfolio", addPortfolioItem);
router.delete("/:userId/portfolio/:portfolioItemId", removePortfolioItem);

export default router;
