import { IsEmail, MinLength } from 'class-validator';
import { isNull } from 'util';

export class UsuarioDto {

 // @MinLength(10)
  cedula: string;
  

  nombre: string;

  apellido: string;

  razonSocial: string;

  @IsEmail()
  correo: string;

  rol: string;

  provincia: string;

  ciudad: string;

  direccion: string;

  telefono: string;

  referenciaDomicilio: string;

  @MinLength(8)
  nombreUsuario: string;

  @MinLength(8)
  claveUsuario: string;

  estado: string;

  fechaCreacion: Date;


}
