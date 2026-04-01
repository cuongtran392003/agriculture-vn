import { IsIn, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  plotId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cropName?: string;

  @IsString()
  @IsOptional()
  scheduledDate?: string;

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