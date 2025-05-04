import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DB } from '@/database';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser, Role, TokenType } from '@interfaces/auth.interface';

const getAuthorization = (req: any) => {
  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id, type } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      if (type !== TokenType.ACCESS) {
        next(new HttpException(403, 'Access permission denied'));
      }

      const findUser = await DB.User.findByPk(id);
      console.log('login user', findUser.dataValues);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    console.log(error);
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const AdminCheckMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { user } = req;
  if (user.getDataValue('role') == Role.ADMIN) {
    next();
  } else next(new HttpException(403, "Cannot access role admin's resource"));
};

export const StaffCheckMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { user } = req;
  const acceptedRoles = [Role.ADMIN, Role.STAFF];
  if (acceptedRoles.includes(user.getDataValue('role'))) {
    next();
  } else next(new HttpException(403, "Cannot access role delieverer's resource"));
};
