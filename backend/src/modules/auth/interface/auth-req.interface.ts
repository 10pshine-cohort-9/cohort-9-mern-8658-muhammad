import { Request } from "express";
import { CurrentUser } from "../types/current-user";

export interface AuthRequest extends Request{
 user:CurrentUser

}