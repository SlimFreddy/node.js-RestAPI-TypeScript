import { boolean } from "joi";

export interface IUsernameValid {
  isValid: boolean;
  message: string;
}
