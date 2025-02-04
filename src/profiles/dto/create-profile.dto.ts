import { IsNotEmpty, IsString } from "class-validator";

export class CreateProfileDto {

    @IsNotEmpty()
    @IsString()
    name: string;

}
