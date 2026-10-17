import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateTaskDto {

  @IsString()
  @IsOptional()
  userId?: string;

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
  @IsDateString()
  scheduledDate: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})?$/)
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
