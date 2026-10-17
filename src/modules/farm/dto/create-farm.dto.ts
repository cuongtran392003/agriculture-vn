import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateFarmDto {

    @IsString()
    @IsOptional()
    userId: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    description?: string

    @IsString()
    location?: string
}
