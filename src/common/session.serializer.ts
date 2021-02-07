import { PassportSerializer } from '@nestjs/passport';
import { HttpService, Injectable } from '@nestjs/common';
import { GoogleUser } from './google.strategy';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  serializeUser(
    user: GoogleUser,
    done: (err: Error, user: GoogleUser) => void,
  ): void {
    done(null, user);
  }

  deserializeUser(
    user: GoogleUser,
    done: (err: Error, user: GoogleUser) => void,
  ): void {
    // can add additional payload
    done(null, user);
  }
}
