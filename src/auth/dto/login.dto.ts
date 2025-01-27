import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El email no puede estar vacio' })
  @IsEmail({}, { message: 'El email ingresado no es valido' })
  email: string;

  @IsNotEmpty({ message: 'El password no puede estar vacio' })
  password: string;
}
