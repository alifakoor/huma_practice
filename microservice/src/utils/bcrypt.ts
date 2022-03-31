import * as bcrypt from 'bcrypt';

export function hashPassword(rawPassword: string): string {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePassword(
  rawPassword: string,
  hashPassword: string,
): boolean {
  return bcrypt.compareSync(rawPassword, hashPassword);
}
