import { Response } from 'express';

const setAccessTokenCookie = (response: Response, accessToken: string) => {
  response.cookie('accessToken', accessToken);
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Cache-Control', [
    'no-cache',
    'no-store',
    'must-revalidate',
  ]);
};

export default setAccessTokenCookie;
