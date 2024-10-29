import {IsNotEmpty, IsString,IsNumber,Min,IsArray} from "class-validator";
export class CreateProductDto {
    
    @IsNotEmpty({message:'El titulo no puede estar vacio!'})
    @IsString()
    title:string;

    @IsNotEmpty({message:'La descripcion no puede estar vacia!'})
    @IsString()
    description:string;

    @IsNotEmpty({message:'El precio no puede estar vacio!'})
    @IsNumber({maxDecimalPlaces:2},{message:'El precio no puede ser mayor a 2 decimales'})
    price:number;
    
    @IsNotEmpty({message:'El stock no puede estar vacio!'})
    @IsNumber({},{message:'El stock debe ser un numero'})
    @Min(0,{message:'El stock no puede ser negativo'})
    stock:number;

    @IsNotEmpty({message:'La imagen no puede estar vacia!'})
    @IsArray({message:'Las imagenes deben tenes el formaato array '})
    images:string[];  

}



