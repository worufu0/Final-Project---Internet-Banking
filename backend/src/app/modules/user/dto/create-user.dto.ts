export class CreateUserDto {
  email: string;
  password: string;
  fullname: string;
  phone: string;
}

export class LoginInput {
  username: string;
  password: string;
  grantType?: string;
}
