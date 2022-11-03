import { compare, hash } from 'bcryptjs';

export class User {
  private _password: string;

  constructor(
    private readonly _email: string,
    private readonly _name: string,
    hashedPassword?: string
  ) {
    if (hashedPassword) {
      this._password = hashedPassword;
    }
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get name(): string {
    return this._name;
  }

  async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }

  async comparePassword(pass: string): Promise<boolean> {
    return compare(pass, this._password);
  }
}
