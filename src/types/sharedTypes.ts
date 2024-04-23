import { IUser } from "./userTypes";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
export interface IAnyObject {
  [key: string]: any;
}

export interface IError extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  isOperational?: boolean;
}
