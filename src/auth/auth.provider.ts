import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: AuthDto) {
    try {
      const { firstName, lastName, email, password } = dto;

      const hash = await argon.hash(password);
      console.log({ hash });

      const user = await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          hash,
        },
      });

      return user;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  async signIn(dto: AuthDto) {
    try {
      const { email, password } = dto;

      const findUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!findUser) {
        throw new ForbiddenException('User not found!');
      }

      const verifyPassword = await argon.verify(findUser.hash, password);

      if (!verifyPassword) {
        throw new ForbiddenException('Password not matched!.');
      }

      const access_Token = await this.generateToken(
        findUser.id,
        findUser.email,
      );

      return {
        access_Token,
      };
    } catch (err) {
      throw new ForbiddenException('Something went wrong!');
    }
  }

  async generateToken(userId: number, email: string) {
    const payload = {
      userId,
      email,
    };

    const access_Token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('SECRET_JWT'),
    });

    return access_Token;
  }
}
