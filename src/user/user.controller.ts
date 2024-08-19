import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from 'src/auth/strategy';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Request } from 'express';

@UseGuards(AuthStrategy)
// @UseGuards(AuthGuard('jwt')) // Case: We can want to pass bearer token, we can also pass bearer token and split the token to then verify that we can also do this using the passport strategy.
@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getUsers() {
    try {
      const getUsers = await this.prisma.user.findMany();

      if (!getUsers) {
        throw new Error('User not found!');
      }
      return getUsers;
    } catch (err) {
      throw new ForbiddenException('Something went wrong!');
    }
  }

  @Get('v1/:email')
  async getUserByEmail(@Param('email') email: string) {
    try {
      console.log({ email });

      const getUser = await this.prisma.user.findUnique({
        where: { email },
      });
      console.log({ getUser });

      if (!getUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { statusCode: HttpStatus.OK, getUser };
    } catch (err) {
      throw new HttpException(
        'Something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('v1/:id')
  async updateUser(@Param('id') id: string, @Body() payload: any) {
    try {
      const parseId = parseInt(id);

      const updateUser = await this.prisma.user.update({
        where: { id: parseId },
        data: payload,
      });

      if (!updateUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { statusCode: HttpStatus.OK, updateUser };
    } catch (err) {
      throw new HttpException(
        'Something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('v1/:id')
  async deleteUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    try {
      const parseId = parseInt(id);

      const removeUser = await this.prisma.user.delete({
        where: { id: parseId },
      });
      console.log({ removeUser });

      if (!removeUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { statusCode: HttpStatus.OK, removeUser };
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }
}
