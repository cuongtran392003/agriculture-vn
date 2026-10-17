import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { getJwtSecret } from '../../../common/config/secrets';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtSecret(configService),
    });
  }

  async validate(payload: any) {
    const legacyRefreshToken = !payload.tokenType && payload.iat && payload.exp && payload.exp - payload.iat > 2 * 24 * 60 * 60;
    if (payload.tokenType === 'refresh' || (payload.tokenType && payload.tokenType !== 'access') || legacyRefreshToken) {
      throw new UnauthorizedException('Invalid access token');
    }
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
