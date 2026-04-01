import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  farmId: string;

  @IsString()
  @IsOptional()
  plotId?: string;


  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cropName?: string;

  @IsString()
  @IsNotEmpty()
  scheduledDate: string;

  @IsString()
  @IsOptional()
  scheduledTime?: string;

  @IsString()
  @IsOptional()
  @IsIn(["pending", "completed", "cancelled"])
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(["low", "medium", "high"])
  priority?: string;

  @IsString()
  @IsOptional()
  note?: string;
}