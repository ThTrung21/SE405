import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { Role } from '@/interfaces/auth.interface';
import { DB } from '@/database';
import { CreateStaffDto, CreateUserDto, UpdatePasswordDto, UpdateUserDto, UpdateUserLikeDto } from '@/dtos/users.dto';
import { faker } from '@faker-js/faker';
import { AVATARS } from '@/database/seeders/constants';
import { Op } from 'sequelize';
import { ChatService } from './chat.service';
@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await DB.User.findAll({
      where: { role: Role.CUSTOMER },
      attributes: {
        exclude: ['password'],
      },
    });

    return allUser;
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
    if (createUserData.id) {
      console.log(`Creating generic conversation for new user ID: ${createUserData.id}`);
      try {
        await ChatService.createGenericConversation(createUserData.id as number); // Cast to number if your userId in ConversationModel is number
        console.log(`Generic conversation created for user ${createUserData.id}`);
      } catch (conversationError) {
        console.error(`Error creating generic conversation for user ${createUserData.id}:`, conversationError);
        // Decide how to handle this error:
        // - Re-throw (prevents user creation if conversation fails)
        // - Log and continue (user is created, but conversation might be missing, requiring manual fix)
        // For most cases, creating the user is critical, so logging and continuing might be acceptable
        // unless the conversation is strictly required for basic user functionality.
      }
    } else {
      console.warn('User ID not available after creation, cannot create generic conversation.');
    }

    return createUserData;
  }

  public async findAllUserForSeed(): Promise<User[]> {
    const allUser: User[] = await DB.User.findAll({
      where: { role: Role.CUSTOMER },
      attributes: {
        exclude: ['password'],
        include: [
          [
            DB.sequelize.literal(`(
              SELECT COUNT(*)
              FROM orders AS o
              WHERE o.user_id = UserModel.id
            )`),
            'orderCount',
          ],
          [
            DB.sequelize.literal(`(
              SELECT COALESCE(SUM(o.total_price), 0)
              FROM orders AS o
              WHERE o.user_id = UserModel.id
            )`),
            'totalPayment',
          ],
        ],
      },
    });

    return allUser;
  }

  public async findAllStaff(): Promise<User[]> {
    const allStaff: User[] = await DB.User.findAll({
      where: { role: { [Op.or]: [Role.STAFF, Role.ADMIN] } },
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
  public async createStaff(userData: CreateStaffDto): Promise<User> {
    const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const _role = userData.role;
    let a;
    if (_role === 'STAFF') a = Role.STAFF;
    if (_role === 'ADMIN') a = Role.ADMIN;
    const hashedPassword = await hash(userData.password, 10);
    const createStaffData: User = await DB.User.create({
      ...userData,
      role: a,
      password: hashedPassword,
      avatar: AVATARS[faker.number.int({ min: 0, max: 1 })],
    });
    return createStaffData;
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
