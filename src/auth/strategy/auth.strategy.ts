import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
// export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     config: ConfigService,
//     private prisma: PrismaService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: config.get('SECRET_JWT'),
//     });
//   }

//   async validate(payload: any) {
//     console.log({ payload });

//     const findUser = await this.prisma.user.findUnique({
//       where: {
//         id: payload.userId,
//       },
//     });

//     if (!findUser) {
//       throw new ForbiddenException('Invalid User!');
//     }

//     return findUser;
//   }
// }
export class AuthStrategy implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException();
      }

      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('SECRET_JWT'),
      });

      return (request['user'] = payload);
    } catch (err) {
      throw new ForbiddenException('Token Expired!');
    }
  }

  private extractTokenFromHeader(request: any) {
    const token = request.headers?.authorization;

    return token ? token : undefined;
  }
}
