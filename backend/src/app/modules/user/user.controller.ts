import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../../vendors/guards/auth.guard';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { BaseController } from '../../../vendors/base/base.controller';

@ApiTags('User')
@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @ApiOperation({ summary: 'API Đăng nhập' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'tuyenbui3030',
          description: 'Tên tài khoản đăng nhập',
        },
        password: {
          type: 'string',
          example: 'matkhaucuatuyen',
          description: 'Mật khẩu đăng nhập',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Response API đăng nhập',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'object',
          example: {
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InR1eWVuYnVpMzAzMCIsInJvbGUiOjAsInVzZXJJZCI6MiwiaWF0IjoxNjY3ODQzNTUwLCJleHAiOjE2Njc4NDUzNTB9.CY3yyF2wiBD6B6oJXDu4M2eqUJD-ZBYBtGneLNUOX1U',
            expiredAt: 1667845350,
          },
          description: 'Access Token',
        },
        refreshToken: {
          type: 'object',
          example: {
            refreshToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InR1eWVuYnVpMzAzMCIsInJvbGUiOjAsInVzZXJJZCI6MiwiaWF0IjoxNjY3ODQzNTUwLCJleHAiOjE2Njc4NDUzNTB9.M-iXYfDpF0l9qnSojIBHNpFa34lduns84SwZuRNZvS8',
            expiredAt: 1667845350,
          },
          description: 'Refresh Token',
        },
        tokenType: {
          type: 'string',
          example: 'Bearer',
          description: 'tokenType',
        },
      },
    },
  })
  @Post('login')
  async login(@Body() loginInput: LoginInput) {
    const { accessToken, refreshToken } = await this.userService.login(
      loginInput,
    );
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };
  }

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.response(await this.userService.createUser(createUserDto));
  }

  @UseGuards(UserGuard)
  @Get('getListAccount')
  async getListAccount(@Req() request) {
    const { id } = request.auth as User;
    return this.response(await this.userService.getListAccount(id));
  }

  @Post('loginEmployee')
  async loginEmployee(@Body() loginInput: LoginInput) {
    const { accessToken, refreshToken } = await this.userService.loginEmployee(
      loginInput,
    );
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };
  }
}
