import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { CreateUserDto, CreateStaffDto } from '@dtos/users.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class UserController {
  public user = Container.get(UserService);
  public getProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const findUser = req.user.dataValues;
      res.status(200).json({ data: findUser, message: 'success' });
    } catch (error) {
      next(error);
    }
  };
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllStaffData: User[] = await this.user.findAllStaff();

      res.status(200).json({ data: findAllStaffData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  public createStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateStaffDto = req.body;
      const createUserData: User = await this.user.createStaff(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
  public updatePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const updatePasswordData = await this.user.updatePassword(user.getDataValue('id'), req.body);

      res.status(200).json({ data: updatePasswordData, message: 'password updated' });
    } catch (error) {
      next(error);
    }
  };
  public updateLikedProduct = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const a = await this.user.updatedLikedProduct(user.getDataValue('id'), req.body);

      res.status(200).json({ data: a, message: 'liked dish updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const updateProfileData = await this.user.updateUser(req.user.getDataValue('id'), req.body);

      res.status(200).json({ data: updateProfileData, message: 'profile updated' });
    } catch (error) {
      next(error);
    }
  };
}
