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
import { UserAuth } from '../../../vendors/guards/auth.guard';
import { Request } from 'express';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return await this.userService.createUser(createUserDto);
  }

  @UseGuards(UserAuth)
  @Get('getListAccount')
  getListAccount(@Query() inputQuery) {
    return this.userService.getListAccount(inputQuery);
  }
}
