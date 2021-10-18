import { IsEmail, IsMongoId, IsOptional, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UsuarioDto {
  // @MinLength(10)
  cedula: string;

  nombre: string;

  apellido: string;

  razonSocial: string;

  @IsOptional()
  @IsEmail()
  correo: string;

  @IsMongoId()
  rol: string;

  provincia: string;

  ciudad: string;

  direccion: string;

  telefono: string;

  referenciaDomicilio: string;

  @MinLength(6)
  nombreUsuario: string;

  @MinLength(6)
  claveUsuario: string;

  estado: string;

  // fechaCreacion: Date;
}

export class ActualizarUsuarioDto extends PartialType(UsuarioDto) {}
