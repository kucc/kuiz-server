import { ParsedUrlQueryInput } from 'querystring';

export interface IRequest extends Request {
  query?: { code: string };
}

export interface GoogleAuthQuery extends ParsedUrlQueryInput {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  prompt: string;
}

export interface GoogleTokenQuery extends ParsedUrlQueryInput {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  code: string;
  grant_type: string;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
}
