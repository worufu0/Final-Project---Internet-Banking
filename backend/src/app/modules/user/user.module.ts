// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { JwtStrategy } from './jwt.strategy';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { UserRepository } from './user.repository';
// import { AccountRepository } from '../account/account.repository';
// import { PassportModule } from '@nestjs/passport';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';

// @Module({
//   imports: [
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.registerAsync({
//       useFactory: async () => ({
//         secretOrPrivateKey: process.env.JWT_SECRET_KEY,
//         signOptions: {
//           expiresIn: process.env.JWT_EXPIRE_TIME,
//         },
//       }),
//     }),
//   ],
//   // imports: [TypeOrmModule.forFeature([User])],
//   controllers: [UserController],
//   providers: [
//     UserService,
//     UserRepository,
//     JwtStrategy,
//     JwtService,
//     AccountRepository,
//   ],
// })
// export class UserModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AccountRepository } from '../account/account.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { EmployeeRepository } from '../employee/employee.repository';
import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      },
      template: {
        dir: path.join(__dirname, '../../../', 'mails'),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    JwtService,
    UserRepository,
    AccountRepository,
    EmployeeRepository,
  ],
})
export class UserModule {}
