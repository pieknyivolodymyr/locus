import { Role } from "../enum/role.enum";
import * as jwt from 'jsonwebtoken';

export const handleDecodeToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  return jwt.decode(token) as { role: Role };
}
