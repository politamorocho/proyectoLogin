import { MinLength } from 'class-validator';

export class RolDto {

    @MinLength(4)
    nombreRol: string;

    descripcionRol: string;
    
    estado: string;


}