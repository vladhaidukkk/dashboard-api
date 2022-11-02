import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDTO {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'Name is required' })
  name: string;
}
