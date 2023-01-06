import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class SecretGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const getRequest = context.switchToHttp().getRequest();
    const timestamp = getRequest.query.timestamp;
    const currentTime = new Date().getTime();
    if (currentTime - Number(timestamp) > 60000000) {
      throw new UnauthorizedException();
    }
    const hash = crypto
      .createHash('sha256')
      .update(getRequest.route.path + timestamp + process.env.SECRET_KEY)
      .digest('hex');
    if (hash === getRequest.get('Authorization').split(' ')[1]) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
