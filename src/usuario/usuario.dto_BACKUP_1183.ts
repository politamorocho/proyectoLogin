<<<<<<< HEAD
import { IsEmail, MinLength } from 'class-validator';
import { isNull } from 'util';

export class UsuarioDto {

 // @MinLength(10)
  cedula: string;
  
=======
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UsuarioDto {

  // @MinLength(10)
  cedula: string;  
>>>>>>> paola

  nombre: string;

  apellido: string;

  razonSocial: string;

  @IsOptional()
  @IsEmail()
  correo: string;

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

  fechaCreacion: Date;


}
