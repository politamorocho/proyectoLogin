import { Document } from 'mongoose';

export interface RolInterface extends Document {
  nombreRol: string;
  descripcionRol: string;
  estado: number;
  //usuario: string
}
