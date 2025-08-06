import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../application/use-cases/user/create-user.use-case";
import {
  GetAllUsersUseCase,
  GetUserByIdUseCase,
} from "../../../application/use-cases/user/get-user.use-case";
import {
  DeleteUserUseCase,
  UpdateUserUseCase,
} from "../../../application/use-cases/user/update-user.use-case";
import { MongoUserRepository } from "../../../infrastructure/repositories/user.repository";
import { PasswordService } from "../../../infrastructure/security/password.service";

// Create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    // Hash the password
    const hashedPassword = await PasswordService.hash(password);

    // Create user with repository pattern and use case
    const userRepository = new MongoUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const user = await createUserUseCase.execute({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const userRepository = new MongoUserRepository();
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

    const users = await getAllUsersUseCase.execute();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userRepository = new MongoUserRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

    const user = await getUserByIdUseCase.execute(req.params["id"]);
    res.json(user);
  } catch (err) {
    if ((err as Error).message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: (err as Error).message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    // Hash password if it's being updated
    if (req.body.password) {
      req.body.password = await PasswordService.hash(req.body.password);
    }

    const userRepository = new MongoUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);

    const user = await updateUserUseCase.execute(req.params["id"], req.body);
    res.json(user);
  } catch (err) {
    if ((err as Error).message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(400).json({ error: (err as Error).message });
    }
  }
};

export const patchUser = async (req: Request, res: Response) => {
  try {
    // Hash password if it's being updated
    if (req.body.password) {
      req.body.password = await PasswordService.hash(req.body.password);
    }

    const userRepository = new MongoUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);

    const user = await updateUserUseCase.execute(req.params["id"], req.body);
    res.json(user);
  } catch (err) {
    if ((err as Error).message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(400).json({ error: (err as Error).message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userRepository = new MongoUserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    await deleteUserUseCase.execute(req.params["id"]);
    res.json({ message: "User deleted" });
  } catch (err) {
    if ((err as Error).message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: (err as Error).message });
    }
  }
};
