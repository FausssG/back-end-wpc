import {IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber} from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({message:'El email no puede estar vacío'})
    @IsEmail({},{message: 'El email ingresado no es valido'})
    email:string
    
    @IsNotEmpty({message:'El nombre no puede estar vacío'})
    @IsString({message: 'El nombre debe ser cadena de texto'})
    firstName:string
    
    @IsNotEmpty({message:'El apellido no puede estar vacío'})
    @IsString({message: 'El apellido debe ser cadena de texto'})
    lastName:string

    @IsNumber()
    @IsOptional()
    roleId: number;
}
