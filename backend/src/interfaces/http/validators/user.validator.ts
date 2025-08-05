import { body } from "express-validator";

export const userValidationRules = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
  body("password")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter"),
  body("password")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  body("password")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
  body("email").custom(async (email) => {
    const User = (
      await import("../../../infrastructure/database/mongodb/models/user.model")
    ).default;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email already in use");
    }
    return true;
  }),
];
