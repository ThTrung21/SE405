import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { Role } from '@/interfaces/auth.interface';
import { DB } from '@/database';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto, UpdateUserLikeDto } from '@/dtos/users.dto';
import { faker } from '@faker-js/faker/.';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await DB.User.findAll({
      where: { role: Role.CUSTOMER },
      attributes: {
        exclude: ['password'],
        include: [
          [
            DB.sequelize.literal(`(
              SELECT COUNT(*)
              FROM orders as o
              where
              o.user_id = UserModel.id
          )`),
            'orderCount',
          ],
          [
            `(
              SELECT SUM(oi.total_price)
              FROM orders as o
              left join order_items oi
              on oi.order_id = o.id
              where o.user_id = UserModel.id
              group by o.user_id
            )`,
            'totalPayment',
          ],
        ],
      },
    });
    return allUser;
  }
  public async findAllStaff(): Promise<User[]> {
    const allStaff: User[] = await DB.User.findAll({
      where: { role: Role.STAFF },
      attributes: {
        exclude: ['password'],
      },
    });
    return allStaff;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await DB.User.create({
      ...userData,
      password: hashedPassword,
      avatar: AVATARS[faker.number.int({ min: 0, max: 1 })],
    });
    return createUserData;
  }

  public async updateUser(userId: number, userData: UpdateUserDto): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.update({ ...userData }, { where: { id: userId } });

    const updateUser: User = await DB.User.findByPk(userId);
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await DB.User.destroy({ where: { id: userId } });

    return findUser;
  }

  public async updatePassword(userId: number, dto: UpdatePasswordDto): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const { oldPassword, newPassword } = dto;

    const isPasswordMatching = await compare(oldPassword, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Current password doesn't match");

    const hashedPassword = await hash(newPassword, 10);
    await DB.User.update({ password: hashedPassword }, { where: { id: userId } });

    return findUser;
  }

  public async updatedLikedProduct(userId: number, userData: UpdateUserLikeDto): Promise<User> {
    const findUser: User = await DB.User.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const newlikedproduct = userData.likedproduct;

    await DB.User.update({ likedproduct: newlikedproduct }, { where: { id: userId } });
    return findUser;
  }
}

