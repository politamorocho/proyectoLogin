import { Injectable } from '@nestjs/common';
import { UsuarioInterface } from './usuario.interface';
import { Model, Mongoose } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
import { isMongoId } from 'class-validator';
import { Schema } from 'mongoose';

import { UsuarioDto } from './usuario.dto';

import { RolService } from 'src/rol/rol.service';


const bcryptjs = require('bcryptjs');


@Injectable()
export class UsuarioService {

    constructor(

        //private readonly model: Model<UsuarioInterface>
        @InjectModel('Usuario') private model: Model<UsuarioInterface>,
        private readonly rolService: RolService
    ) { }


    async crearUsuario(usuario: UsuarioDto): Promise<UsuarioInterface | boolean> {

        //verifica si existe el correo
        const correoExiste = await this.model.findOne({
            correo: usuario.correo
        });

        //si el correo existe, no se puede  crear el usuario
        if (correoExiste) {
            return false
        }

        //preguntar si el rol es un  id valid de mongo
        if (!isMongoId(usuario.rol)) {
            return false
        }


        //si es un mongoid valido, verifica que exista
        const rolId = await this.rolService.verificaRolId(usuario.rol);
        if (!rolId) {
            return false
        }


        //pregunta si es un rol activo
        const rolActivo = await this.rolService.verificaRolActivo(usuario.rol);
        if (!rolActivo) {
            return false
        }

        //si no existe el correo y existe el rol, entonces crea el usuario
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

    //lista todos los usuarios con estado true-activo
    async listarUsuarios() {

        const query = { estado: true };
        const usuariosLista = await this.model.find(query)
            .populate('rol', 'nombreRol')

        return usuariosLista;
    }

    //listar todos los usuarios con estado true o false
    async listarTodos() {

        //const query = { estado: true };
        const usuariosLista = await this.model.find()
            .populate('rol', '-_id -__v')

        return usuariosLista;
    }

    //lista la info de un usuario buscado por su MongoID
    async listarUsuarioID(usuarioID: string): Promise<UsuarioInterface | boolean> {


        const data = await this.model.findOne({ _id: usuarioID })
            .populate('rol', '-_id -__v')

        if (!data) {
            return false
        }
        if (!data.estado) {
            return false
        }

        return data;

    }


    //actualizar usuario
    async actualizarUsuario(usuarioActualizado: UsuarioDto, id: string): Promise<UsuarioInterface | boolean> {
        const existeID = await this.model.findOne({ _id: id });


        //pregunta si existe el id que llega, si no existe sale.
        if (!existeID) {
            return false
        }

        //pregunta el estado del usuario que llega, si es false sale.
        if (!existeID.estado) {
            return false
        }

        //verifica si existe el correo, si existe no puede actualizar
        const correoExiste = await this.model.findOne({
            correo: usuarioActualizado.correo
        });

        if (correoExiste) {
            return false
        }

        //verifica el id de rol que sea valido
        if (!isMongoId(usuarioActualizado.rol)) {
            return false
        }

        //si es un mongoid valido, verifica que exista
        const rolId = await this.rolService.verificaRolId(usuarioActualizado.rol);
        if (!rolId) {
            return false
        }

        //pregunta si es un rol activo
        const rolActivo = await this.rolService.verificaRolActivo(usuarioActualizado.rol);
        if (!rolActivo) {
            return false
        }

        const usuActEntity = new this.model(usuarioActualizado);

        const { rol, claveUsuario, ...data } = usuarioActualizado
        //console.log('data es', data)

        usuActEntity.rol = mongoose.Types.ObjectId(usuarioActualizado.rol);

        const salt = bcryptjs.genSaltSync(10);
        usuActEntity.claveUsuario = bcryptjs.hashSync(usuarioActualizado.claveUsuario, salt);


        const { _id, ...resto } = usuActEntity

        console.log('usuario Entity: ', usuActEntity)

        const actualizado = existeID.overwrite(usuActEntity);
        actualizado.save()
        // const actualizado = await this.model.findByIdAndUpdate (id,  resto, {new:true});


        return actualizado
    }


    //borrar usuario logico
    async borradoLogico(usuarioID: string) {
        const existeID = await this.model.findOne({ _id: usuarioID });

        if (!existeID) {
            return false
        }
        if (!existeID.estado) {
            return false
        }


        if (existeID && existeID.estado === true) {
            const usuarioBorrado = await this.model.findByIdAndUpdate(usuarioID, { estado: false }, { new: true });
            return usuarioBorrado
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

    async validarUsuario(correo: string, claveUsuario: string) {

        //verificar que exista el correo
        const existeUsuario = await this.model.findOne({
            correo
        })

        if (!existeUsuario) {
            return false
        }

        //si el estado es false
        if (!existeUsuario.estado) {
            return false;
        }

        //compara la clave
        const claveValida = await bcryptjs.compareSync(claveUsuario, existeUsuario.claveUsuario);

        if (!claveValida) {
            return false
        }

        return existeUsuario

    }


}