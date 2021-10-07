import { Document } from "mongoose";

export interface RolInterface extends Document {
    nombreRol: string;
    descripcionRol: string;
    estado: string;
    //usuario: string
}