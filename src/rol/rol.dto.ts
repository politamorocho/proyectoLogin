import {
  IsNumber,
  Length,
  MinLength,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class RolDto {
  @IsNotEmpty()
  @MinLength(4)
  nombreRol: string;

  @IsNotEmpty()
  descripcionRol: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1)
  // @Length(1)
  estado: number;
}

export class ActualizarRolDto extends PartialType(RolDto) {}
