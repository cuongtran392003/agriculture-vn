import { IsNotEmpty, IsOptional, IsString } from "class-validator"


export class CreatePlotDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    code?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsNotEmpty()
    farmId: string
}