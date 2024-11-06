import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto{

    @IsNotEmpty({message:'El nombre no puede estar vacío'})
    @IsString({message: 'El nombre debe ser cadena de texto'})
    name:string;

}