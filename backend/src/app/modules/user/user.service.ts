import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_ERRORS } from '../../../configs/constants/error-code';
import { AccountType } from '../../../configs/enum/account';
import { AccountRepository } from '../account/account.repository';
import { Account } from '../account/entities/account.entity';
import { CreateUserDto, LoginInput } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { SALT_ROUNDS } from '../../../configs/constants/auth';
import { User } from './entities/user.entity';
import { BaseException } from '../../../vendors/exceptions/base.exception';
import { EmployeeRepository } from '../employee/employee.repository';
import { generateOTP } from '../../../app/utils/genarate-otp';
import { OtpTransaction } from '../account/entities/otp.entity';
import { OtpType } from '../../../configs/enum/otp';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private employeeRepository: EmployeeRepository,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  /**
   * encode password
   * @param password
   * @returns
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, phone, fullname, password } = createUserDto;
    console.log(email);
    const checkUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (checkUser) {
      throw new BaseException(
        'USER_EXISTS',
        'User đã tồn tại',
        null,
        HttpStatus.OK,
      );
    }
    createUserDto.password = await this.hashPassword(createUserDto.password);
    const user = await this.userRepository.save({
      email,
      phone,
      fullname,
      password: await this.hashPassword(password),
    });
    await this.accountRepository.save([
      {
        accountType: AccountType.PaymentAccount,
        accountNumber: String(
          Math.floor(100000000 + Math.random() * 900000000),
        ),
        user,
      },
      {
        accountType: AccountType.SavingAccount,
        accountNumber: String(
          Math.floor(100000000 + Math.random() * 900000000),
        ),
        user,
      },
    ]);
    return await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        accounts: true,
      },
    });
  }

  getListAccount(id) {
    return this.accountRepository.find({
      where: {
        user: {
          id,
        },
      },
    });
  }

  /**
   * verify email and password is correct and return user infomation
   * @param email
   * @param password
   * @returns
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(username);
    if (!user) {
      throw new BaseException(
        USER_ERRORS.USER_NOT_FOUND.code,
        USER_ERRORS.USER_NOT_FOUND.message,
        null,
        HttpStatus.FORBIDDEN,
      );
    }
    // compare encode password with old password
    const passwordMatched = bcrypt.compareSync(password, user.password);
    if (passwordMatched) {
      return {
        username: user.email,
        id: user.id,
        fullname: user.fullname,
        role: user,
      };
    }
    throw new BaseException(
      USER_ERRORS.WRONG_PASSWORD.code,
      USER_ERRORS.WRONG_PASSWORD.message,
      null,
      HttpStatus.FORBIDDEN,
    );
  }

  /**
   * generate token by user info and access token setting
   * @param payload
   * @returns
   */
  getAccessToken(payload) {
    const options = {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_EXPIRE_TIME,
    };
    const accessToken = this.jwtService.sign(payload, options);
    const verify = this.jwtService.verify(accessToken, options);
    return {
      accessToken,
      expiredAt: verify.exp,
    };
  }

  /**
   * generate token by user info and refresh token setting
   * @param payload
   * @returns
   */
  getRefreshToken(payload) {
    const options = {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
    };
    const refreshToken = this.jwtService.sign(payload, options);
    const verify = this.jwtService.verify(refreshToken, options);
    return {
      refreshToken,
      expiredAt: verify.exp,
    };
  }

  async login(user: LoginInput) {
    const userDb = await this.validateUser(user.username, user.password);
    const payloadToken = {
      username: userDb.username,
      fullname: userDb.fullname,
      id: userDb.id,
    };
    const accessToken = this.getAccessToken(payloadToken);
    const refreshToken = this.getRefreshToken(payloadToken);

    userDb.refreshToken = refreshToken.refreshToken;
    userDb.expiredAt = moment(refreshToken.expiredAt * 1000).toDate();

    await this.userRepository.save(userDb);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateEmployee(username: string, password: string): Promise<any> {
    const employee = await this.employeeRepository.findOneBy({ username });
    if (!employee) {
      throw new BaseException(
        USER_ERRORS.USER_NOT_FOUND.code,
        USER_ERRORS.USER_NOT_FOUND.message,
        null,
        HttpStatus.FORBIDDEN,
      );
    }
    // compare encode password with old password
    const passwordMatched = bcrypt.compareSync(password, employee.password);
    if (passwordMatched) {
      return {
        username: employee.username,
        id: employee.id,
        role: employee.employeeRole,
      };
    }
    throw new BaseException(
      USER_ERRORS.WRONG_PASSWORD.code,
      USER_ERRORS.WRONG_PASSWORD.message,
      null,
      HttpStatus.FORBIDDEN,
    );
  }

  async loginEmployee(user: LoginInput) {
    const employeeDb = await this.validateEmployee(
      user.username,
      user.password,
    );

    const payloadToken = {
      username: employeeDb.username,
      role: employeeDb.role,
      id: employeeDb.id,
    };
    const accessToken = this.getAccessToken(payloadToken);
    const refreshToken = this.getRefreshToken(payloadToken);

    employeeDb.refreshToken = refreshToken.refreshToken;
    employeeDb.expiredAt = moment(refreshToken.expiredAt * 1000).toDate();

    await this.employeeRepository.save(employeeDb);
    return {
      accessToken,
      refreshToken,
    };
  }

  async getOtResetPassword(email: string) {
    const generateOtp = generateOTP();
    const otpTransaction = new OtpTransaction();
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BaseException(
        'EMAIL_NOT_EXISTS',
        'EMAIL_NOT_EXISTS',
        null,
        HttpStatus.FORBIDDEN,
      );
    }
    otpTransaction.user = user;
    otpTransaction.otp = generateOtp;
    otpTransaction.type = OtpType.ResetPassword;
    otpTransaction.expire = moment().add(10, 'minutes').unix();
    await otpTransaction.save();
    await this.mailService.sendMail({
      to: user.email,
      from: 'notolistore@gmail.com',
      subject: 'Meomeo Bank send OTP',
      template: 'email-change-password',
      context: {
        data: {
          fullname: user.fullname,
          otp: generateOtp,
        },
      },
    });
    console.log('email: ', email);
    return {
      message: 'Success',
    };
  }

  /**
   * remove fresh token to make sure user can not genate new access token without password
   * @param userId
   * @returns
   */
  async logout(userId: any) {
    return await this.userRepository.update(
      { id: userId },
      { refreshToken: null },
    );
  }
}
