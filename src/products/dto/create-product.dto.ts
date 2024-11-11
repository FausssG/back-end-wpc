import {IsNotEmpty, IsString,IsNumber,Min,IsArray} from "class-validator";
export class CreateProductDto {
    
    @IsNotEmpty({message:'El titulo no puede estar vacio!'})
    @IsString({message: 'Tiene que ser string'})
    title:string;

    @IsNotEmpty({message:'La descripcion no puede estar vacia!'})
    @IsString({message: 'Tiene que ser string'})
    description:string;

    
    // @IsNotEmpty({message:'El stock no puede estar vacio!'})
    // @IsNumber({},{message:'El stock debe ser un numero'})
    // @Min(0,{message:'El stock no puede ser negativo'})
    // stock:number;

    // @IsNotEmpty({message:'La imagen no puede estar vacia!'})
    // @IsArray({message:'Las imagenes deben tenes el formaato array '})
    // images:string[];  

    // @IsNotEmpty({message:'El stock no puede estar vacio!'})
    // @IsNumber({},{message:'El stock debe ser un numero'})
    // @Min(0,{message:'El stock no puede ser negativo'})
    // colorId: number;

}



