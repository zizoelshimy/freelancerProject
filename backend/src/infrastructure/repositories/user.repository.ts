import mongoose, { Document, Model } from "mongoose";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/interfaces/repositories/user.repository";
import UserModel, { IUser } from "../database/mongodb/models/user.model";

export class MongoUserRepository implements UserRepository {
  private model: Model<IUser>;

  constructor() {
    this.model = UserModel;
  }

  async findAll(): Promise<User[]> {
    const users = await this.model.find().exec();
    return users.map((user) => this.documentToEntity(user));
  }

  async findById(id: string): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await this.model.findById(id).exec();
    return user ? this.documentToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.model.findOne({ email }).exec();
    return user ? this.documentToEntity(user) : null;
  }

  async create(userData: User): Promise<User> {
    const newUser = new this.model(userData);
    const savedUser = await newUser.save();
    return this.documentToEntity(savedUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const updatedUser = await this.model
      .findByIdAndUpdate(id, { $set: userData }, { new: true })
      .exec();

    return updatedUser ? this.documentToEntity(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  private documentToEntity(document: Document): User {
    const {
      _id,
      fullName,
      email,
      password,
      profileImage,
      bio,
      skills,
      experience,
      portfolio,
      rating,
      completedJobs,
      createdAt,
      updatedAt,
    } = document.toObject();

    return {
      id: _id.toString(),
      fullName,
      email,
      password,
      profileImage,
      bio,
      skills,
      experience: experience?.map((exp: any) => ({
        id: exp._id?.toString(),
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        current: exp.current,
      })),
      portfolio: portfolio?.map((item: any) => ({
        id: item._id?.toString(),
        title: item.title,
        description: item.description,
        category: item.category,
        fileUrl: item.fileUrl,
        createdAt: item.createdAt,
      })),
      rating,
      completedJobs,
      createdAt,
      updatedAt,
    };
  }
}
