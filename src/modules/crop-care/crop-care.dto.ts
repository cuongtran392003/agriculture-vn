import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CareRuleDto {
  @IsString() @IsNotEmpty() @MaxLength(80) id: string;
  @IsIn(['watering', 'fertilizing', 'pruning', 'harvesting']) action: string;
  @IsInt() @Min(0) @Max(730) day: number;
  @IsOptional() @IsInt() @Min(1) @Max(365) repeatEveryDays?: number;
  @IsString() @IsNotEmpty() @MaxLength(2000) guidance: string;
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) time: string;
  @IsOptional() @IsNumber() @Min(0) @Max(500) rainThresholdMm?: number;
  @IsOptional() @IsNumber() @Min(20) @Max(60) heatThresholdC?: number;
}

export class CareStageDto {
  @IsString() @IsNotEmpty() @MaxLength(80) name: string;
  @IsInt() @Min(1) @Max(730) durationDays: number;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CareRuleDto)
  rules: CareRuleDto[];
}

export class CreateCareTemplateDto {
  @IsString() @IsNotEmpty() @MaxLength(100) cropName: string;
  @IsString() @IsNotEmpty() @MaxLength(100) region: string;
  @IsString() @IsNotEmpty() @MaxLength(2000) source: string;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => CareStageDto)
  stages: CareStageDto[];
}

export class CreateCarePlanDto {
  @IsMongoId() templateId: string;
  @IsMongoId() farmId: string;
  @IsOptional() @IsMongoId() plotId?: string;
  @Matches(/^\d{4}-\d{2}-\d{2}$/) plantingDate: string;
  @IsOptional() @IsString() @IsNotEmpty() currentStage?: string;
  @IsOptional() @Matches(/^\d{4}-\d{2}-\d{2}$/) stageStartedOn?: string;
  @IsLatitude() latitude: number;
  @IsLongitude() longitude: number;
}

export class UpdateCarePlanDto {
  @IsBoolean() active: boolean;
}
