import { Document } from "mongoose";

export interface UsuarioInterface extends Document {

  cedula: string;
  nombre: string;
  apellido: string;
  razonSocial: string;
  correo: string;
  rol: string;
  provincia: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  referenciaDomicilio: string;
  nombreUsuario: string;
  claveUsuario: string;
  estado: boolean;
  fechaCreacion: Date;
}
