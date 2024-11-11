import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";



export class UserSignInDto {
    @IsNotEmpty({message:'El email no puede estar vacío'})
    @IsEmail({},{message: 'El email ingresado no es valido'})
    email:string;

    @IsNotEmpty({message:'El password no puede estar vacío'})
    @MinLength(5,{message: 'La contraseña debe tener un mínimo de 5 caracteres'})
    password:string;

}