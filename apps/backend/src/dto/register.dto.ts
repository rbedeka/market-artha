import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

/**
 *  {
  username: 'red',
  password: 'GoogleGLas1$',
  confirmPassword: 'GoogleGLas1$',
  email: 'rohit@example.com'
}

 */
