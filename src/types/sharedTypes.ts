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
