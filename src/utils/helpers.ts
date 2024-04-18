import { IAnyObject } from "../types";

export const filterObj = (obj: IAnyObject, ...allowedFields: string[]) => {
  const newObj: IAnyObject = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
