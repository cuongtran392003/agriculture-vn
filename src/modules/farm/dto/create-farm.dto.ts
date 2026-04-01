import { IsNotEmpty, IsString } from "class-validator";


export class CreateFarmDto {

    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    description?: string

    @IsString()
    location?: string
}