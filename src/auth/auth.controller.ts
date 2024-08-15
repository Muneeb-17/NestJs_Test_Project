import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.provider';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  // signUp(@Req() Request: Request) {
  //   console.log({ Request });

  //   return this.authService.signUp();
  // }

  // signUp(@Body() dto: AuthDto) {
  //   console.log({ Request });

  //   return this.authService.signUp();
  // }
  // signUp(
  //   @Body('email') email: string,
  //   @Body('password', ParseIntPipe) password: string,
  // ) {
  //   console.log({
  //     email,
  //     password,
  //     typeEmial: typeof password,
  //   });

  //   return this.authService.signUp();
  // }
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
