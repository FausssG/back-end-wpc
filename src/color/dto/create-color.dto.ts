import { IsNotEmpty, IsString, IsNumber ,IsPositive} from 'class-validator';
export class CreateColorDto {

    @IsNotEmpty({message:'No puede ser vacio'})
    @IsString()
    name: string;

    
    @IsNotEmpty({message:'El precio no puede estar vacio!'})
    @IsNumber({maxDecimalPlaces:2},{message:'El precio no puede ser mayor a 2 decimales'})
    price:number;

}
