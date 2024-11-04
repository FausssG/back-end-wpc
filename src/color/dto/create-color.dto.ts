import { IsNotEmpty, IsString, IsNumber ,IsPositive} from 'class-validator';
export class CreateColorDto {

    @IsNotEmpty({message:'No puede ser vacio'})
    @IsString()
    name: string;


    @IsNotEmpty({message:'No puede ser vacio'})
    @IsNumber({maxDecimalPlaces:2},{message:'Debe ser un numero'})
    @IsPositive({message:'Debe ser un numero positivo'})
    productId: number;

}
