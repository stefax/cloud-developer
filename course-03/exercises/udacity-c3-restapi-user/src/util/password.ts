import * as bcrypt from "bcrypt";

export async function generatePassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  return await bcrypt.hash(plainTextPassword, salt);
}

export async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hash);
}

