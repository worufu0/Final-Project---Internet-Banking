import {
  HttpException,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './app/modules/account/account.module';
import { ReceiverModule } from './app/modules/receiver/receiver.module';
import { TransactionHistoryModule } from './app/modules/transaction-history/transaction-history.module';
import { EmployeeModule } from './app/modules/employee/employee.module';
import { ConfigModule } from '@nestjs/config';
import { Logger } from './common/logger/logger';
import dbConfig from './configs/db/mySql';
import { BaseException } from './vendors/exceptions/base.exception';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    UserModule,
    TypeOrmModule.forRoot(dbConfig),
    AccountModule,
    ReceiverModule,
    EmployeeModule,
    TransactionHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  async onModuleInit() {
    await this.init();
  }
  async init() {
    process.on('unhandledRejection', (reason) => {
      throw new BaseException(
        'unhandledRejection',
        'Unhandled Rejection',
        reason,
      );
    });
    new Logger().log(`${AppModule.name} init`);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
