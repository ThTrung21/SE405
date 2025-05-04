import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import { RefreshTokenDto } from '@/dtos/auth.dto';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      console.log(req.body);
      const { token, findUser } = await this.auth.login(userData);

      // res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, token: token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const tokenData: RefreshTokenDto = req.body;
      const refreshTokenData = await this.auth.refreshToken(tokenData);
      res.status(200).json({ data: refreshTokenData, message: 'refresh' });
    } catch (error) {
      next(error);
    }
  };

  public userRoute = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: req.user, message: 'you have accessed user route!' });
    } catch (error) {
      next(error);
    }
  };

  public adminRoute = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: req.user, message: 'you have accessed admin route!' });
    } catch (error) {
      next(error);
    }
  };
}
