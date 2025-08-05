import { Request, Response } from "express";
import { AuthUserUseCase } from "../../../application/use-cases/user/auth-user.use-case";
import { MongoUserRepository } from "../../../infrastructure/repositories/user.repository";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRepository = new MongoUserRepository();
    const authUserUseCase = new AuthUserUseCase(userRepository);
    const result = await authUserUseCase.execute({ email, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
};
