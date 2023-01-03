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
export class RsaGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('rsa');
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      this.jwtService.verify(token, {
        publicKey: process.env.PUBLIC_KEY,
        algorithms: ['RS256'],
      });
      const decode = this.jwtService.decode(token);
      console.log('decode: ', decode);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  public getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
