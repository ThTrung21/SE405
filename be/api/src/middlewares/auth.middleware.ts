import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UserModel } from '@models/users.model';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const findUser = UserModel.find(user => user.id === id);

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
  const acceptedRoles = [Role.ADMIN, Role.DELIVERER];
  if (acceptedRoles.includes(user.getDataValue('role'))) {
    next();
  } else next(new HttpException(403, "Cannot access role delieverer's resource"));
};
