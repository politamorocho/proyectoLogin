import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { upperCase } from "upper-case";

import { UsuarioService } from 'src/usuario/usuario.service';

import { RolDto } from './rol.dto';
import { RolInterface } from './rol.interface';

@Injectable()
export class RolService {

    constructor(
        //private readonly usuarioService:UsuarioService,
        @InjectModel('Rol') private model: Model<RolInterface>,
    ) { }

    async crearRol(rol: RolDto) {

        const nombre = upperCase(rol.nombreRol);
        const estado = upperCase(rol.estado);

        const nombreRolExiste = await this.model.findOne({ nombreRol: nombre })

        //si existe no se crea
        if (nombreRolExiste) {
            return false
        }


        const data = {
            nombreRol: nombre,
            descripcionRol: rol.descripcionRol,
            estado: estado

        }

        const resultado = await new this.model(data).save();
        return resultado;

    }

    async listarTodos() {
        const listaRol = await this.model.find();

        return listaRol;
    }

    async listarRolesActivos() {
        const query = { estado: 'ACTIVO' };
        const listaRol = await this.model.find(query);

        return listaRol;
    }

    async mostrarRol(id: string) {
        const existeRol = await this.model.findById({ id });

        if (!existeRol) {
            return false
        }

        return existeRol;
    }

    async actualizarRol(rolActual: RolDto, id: string) {
        const existeID = await this.model.findOne({ _id: id })
        // const existeID = this.encontrarUsuariosPorID(rolActual._id);


        if (!existeID) {
            return false
        }

        if (existeID.estado === 'INACTIVO') {
            return false
        }


        const rolMayus = upperCase(rolActual.nombreRol);
        const estadoMayus= upperCase(rolActual.estado);

        rolActual.nombreRol=rolMayus;
        rolActual.estado=estadoMayus;

        const actualizado = await this.model.findByIdAndUpdate(
            id, rolActual, { new: true })


        return actualizado


    }

    async borradoLogico(rolId: string) {
        const existeID = await this.model.findOne({ _id: rolId });

        if (!existeID) {
            return false
        }
        if (existeID.estado === 'INACTIVO') {
            return false
        }

        const rolBorrado = await this.model.findByIdAndUpdate(rolId, { estado: 'INACTIVO' }, { new: true });
        return rolBorrado


    }


    async verificaSiExisteRol(nombre: string) {

        const rolBuscar = upperCase(nombre);
        const rolExiste = await this.model.findOne({ nombreRol: rolBuscar });

        if (!rolExiste) {
            return false
        }

        if(rolExiste.estado === 'INACTIVO'){
            return false
        }

        return rolExiste;
    }

    async verificaRolId(id: string) {
        const rolExiste = await this.model.findById({ _id: id });

        if (!rolExiste) {
            return false
        }
        return true;
    }

    async verificaRolActivo(id:string){
        const rolExiste = await this.model.findById({ _id: id });
        
        if(rolExiste.estado === 'INACTIVO'){
            return false
        }

        return true
    }

    async verificaRolActivo2(id:string){
        const rolExiste = await this.model.findById({ _id: id });
        
        if(rolExiste.estado === 'INACTIVO'){
            return false
        }

        return rolExiste
    }


    // async tipoRol(id:string){
    //     const esAdmin= this.usuarioService.tipoRol(id);
    //     if(!esAdmin){
    //         return  false
    //     }
    //     return true
    // }



}
