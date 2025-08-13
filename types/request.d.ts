import { Request } from 'express';

declare global {
  namespace Express {
    interface UserJwt {
      userId: number;
    }
    interface Request {
      user?: UserJwt;
    }
  }
}

export { };