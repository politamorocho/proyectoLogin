import { Inject, Injectable } from '@nestjs/common';
import { UsuarioInterface } from './usuario.interface';
import { Model } from 'mongoose';
import {InjectModel}  from '@nestjs/mongoose';


import { UsuarioDto } from './usuario.dto';

const bcryptjs = require('bcryptjs');


@Injectable()
export class UsuarioService {

    constructor(
        //private readonly model: Model<UsuarioInterface>
        @InjectModel('Usuario') private model: Model<UsuarioInterface>,
    ) { }


    async crearUsuario(usuario: UsuarioDto): Promise<UsuarioInterface | boolean> {

        //verifica si existe el correo
        const correoExiste = await this.model.findOne({
            correo: usuario.correo
        });

        if (correoExiste){
            return false
        }

        //si no existe entonces crea el usuario
        if (!correoExiste) {

            //encriptar la clave
            const salt = bcryptjs.genSaltSync(10);
            usuario.claveUsuario = bcryptjs.hashSync(usuario.claveUsuario, salt);

            //guardar en bd
            const resultado = await new this.model(usuario).save();
            return resultado;
        } else {
            return correoExiste;
        }

    }

    //lista todos los usuarios
    async listarUsuarios() {

        const query={estado:true};
        const usuariosLista = await this.model.find(query);
        
        return usuariosLista;
    }

    //lista la info de un usuario buscado por su MongoID
    async listarUsuarioID(usuarioID: string) {


        const data = await this.model.findOne({_id:usuarioID});
 
        if(!data){
            return false
        }
        if(!data.estado){
            return false
        }

        return data;
        // const existeID = this.model.findOne({_id:usuarioID});
        // if (existeID) {
        //     const infoUsuario = await this.model.find();
        //     return infoUsuario
        // } else {
        //     return false
        // }

    }


    //actualizar usuario
    async actualizarUsuario(usuarioActualizado: UsuarioDto | any) {
        const existeID= await this.model.findOne({_id:usuarioActualizado._id})
        // const existeID = this.encontrarUsuariosPorID(usuarioActualizado._id);

        if(!existeID){
            return false
        }

        if (!existeID.estado){
            return false
        }

        if (existeID) {

            const actualizado = await this.model.findByIdAndUpdate(
                usuarioActualizado._id, usuarioActualizado, { new: true }
            )
            return actualizado
        } 

    }

    //borrar usuario logico
    async borradoLogico(usuarioID: string) {
        const existeID = this.encontrarUsuariosPorID(usuarioID);

        if (existeID) {
            const usuarioBorrado = await this.model.findByIdAndUpdate(usuarioID, { estado: false }, { new: true });
            return usuarioBorrado
        } else {
            return existeID
        }

    }


    async encontrarUsuariosPorID(usuarioId: string) {
        return await this.model.findOne({
            _id: usuarioId
        })

    }

    async encontrarUsuariosPorCorreo(correo: string) {
        return await this.model.findOne({
            correo
        })
    }

    async validarUsuario(correo: string, clave: string) {

        //verificar que exista el correo
        const existeUsuario = await this.model.findOne({
            correo
        })


        if (!existeUsuario) {
            return false;
        }

        //verificar el estado
        if (!existeUsuario.estado) {
            return false
        }

        const claveValida = bcryptjs.compareSync(clave, existeUsuario.claveUsuario);
        if (!claveValida) {
            return false
        }

        return existeUsuario;

    }
}