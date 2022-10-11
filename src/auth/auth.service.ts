import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegistrationDto } from './dto/registration.dto';
import * as bcrypt from 'bcrypt';
import PostgresErrorCode from '../database/postgresErrorCodes.enum';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './tokenPayload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogout() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0;';
  }

  async register(registrationData: RegistrationDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(password, user.password);
      return user;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
    if (!isCorrectPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
