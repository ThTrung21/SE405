import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { DB } from '@/database';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/HttpException';
import { DataStoredInToken, Role, Status, TokenData, TokenPayload, TokenType } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { RefreshTokenDto } from '@/dtos/auth.dto';

const createToken = (user: User, exp: number, type: TokenType): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id, role: user.role, type: type };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

@Service()
export class AuthService {
  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException.HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await DB.User.create({ ...userData, password: hashedPassword, status: Status.ACTIVE, role: Role.STAFF });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ token: TokenPayload; findUser: User }> {
    const findUser: User = await DB.User.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const accessTokenExp = 60 * 60;
    const refreshTokenExp = 24 * 60 * 60;
    const { token: accessToken } = createToken(findUser, accessTokenExp, TokenType.ACCESS);
    const { token: refreshToken } = createToken(findUser, refreshTokenExp, TokenType.REFRESH);

    return { token: { accessToken, refreshToken }, findUser };
  }

  public async refreshToken(tokenData: RefreshTokenDto): Promise<{ token: string }> {
    const { refreshToken } = tokenData;
    const { id, type } = verify(refreshToken, SECRET_KEY) as DataStoredInToken;

    if (type !== TokenType.REFRESH) throw new HttpException(403, 'Access permission denied!');

    const findUser = await DB.User.findByPk(id);
    if (!findUser) throw new HttpException(409, `This user ${id} was not found`);

    const accessTokenExp = 60 * 60;
    const { token } = createToken(findUser, accessTokenExp, TokenType.ACCESS);

    return { token };
  }
}
