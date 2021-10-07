
import { IsEmail, MinLength } from 'class-validator';

export class LoginDTO {

  @IsEmail()
  correo: string;

  @MinLength(6)
  claveUsuario: string;
}