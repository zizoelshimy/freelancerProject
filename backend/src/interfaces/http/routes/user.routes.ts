import { Router } from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  patchUser,
} from "../controllers/user.controller";
import { userValidationRules } from "../validators/user.validator";
import { validationResult } from "express-validator";

const router = Router();

// Middleware to handle validation errors
import { Request, Response, NextFunction } from "express";
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

router.post("/", userValidationRules, validate, createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.patch("/:id", patchUser);
router.delete("/:id", deleteUser);

export default router;
