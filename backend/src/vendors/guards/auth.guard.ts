import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

// Check if username in field for query matches authenticated user's username
// or if the user is admin
@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    console.log('yaya');
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('aaaa');
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      const options = {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRE_TIME,
      };
      this.jwtService.verify(token, options);
      const user = this.jwtService.decode(token);
      request.auth = user;
      return super.canActivate(context);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  public getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
