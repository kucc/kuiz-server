import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config();

export interface GoogleUser {
  email: string;
  name: string;
  accessToken: string;
}

interface GoogleUserProfile {
  id: string;
  name: { familyName: string | null; givenName: string };
  emails: [{ value: string; verified: boolean }];
  provider: string;
}

export interface IRequest extends Request {
  user: GoogleUser;
  logout?: () => void;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:4000/api/auth/redirect',
      include_granted_scopes: 'true',
      responseType: 'code',
      accessType: 'offline',
      scope: ['email', 'profile'],
      prompt: 'login',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleUserProfile,
    done: VerifyCallback,
  ): Promise<GoogleUser> {
    const { name, emails } = profile;

    const googleUser: GoogleUser = {
      email: emails[0].value,
      name: name.familyName ? name.givenName + name.familyName : name.givenName,
      accessToken,
    };

    done(null, googleUser);

    return googleUser;
    //done(null, user)를 통해 user를 passport.serializeUser에 전달
    //이 후 서버에 request가 오는 경우 매번 passport.deserializeUser를 실행하여 session에서 user를 꺼내 user를 복원.
  }
}
