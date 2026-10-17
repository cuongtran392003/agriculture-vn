import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateCropDto {
  @Transform(trimString)
  @IsString()
  @Matches(/\S/, { message: 'Tên cây trồng không được để trống' })
  @MaxLength(100)
  name: string;

  @ValidateIf((_, value) => value !== undefined)
  @Transform(trimString)
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  variety?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ValidateIf((_, value) => value !== undefined)
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item) => (typeof item === 'string' ? item.trim() : item))
      : value,
  )
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/\S/, { each: true })
  @MaxLength(100, { each: true })
  regions?: string[];
}

export class UpdateCropDto extends PartialType(CreateCropDto, {
  skipNullProperties: false,
}) {}

export class ListCropsDto extends PaginationDto {
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trimString)
  @IsString()
  @MaxLength(100)
  search?: string;

  @ValidateIf((_, value) => value !== undefined)
  @Transform(trimString)
  @IsString()
  @MaxLength(100)
  region?: string;
}
