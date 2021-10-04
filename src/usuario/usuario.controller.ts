import {  Controller, Get, HttpException, HttpStatus, Post, Body, Res, Param, Delete } from '@nestjs/common';
import { Response } from 'express';
import { UsuarioDto } from './usuario.dto';
import { UsuarioService } from './usuario.service';
import { MongoIdPipe } from '../common/mongo-id.pipe';
//import { IsMongoId, isMongoId } from 'class-validator';
const { check } = require('express-validator');


@Controller('usuario')
export class UsuarioController {

    constructor(private readonly UsuarioService: UsuarioService) { }


    @Post('/')
    async crearUsuario(@Body() usuario: UsuarioDto, @Res() response: Response) {
        const usuarioCreado = await this.UsuarioService.crearUsuario(usuario);
        if (usuarioCreado) {
            response.status( HttpStatus.OK).json({
                data: usuarioCreado,
            });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'correo ya registrado',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

    }

    @Get('/listar')
    async listarUsuarios(@Res() response: Response) {



        const listaUsuarios = await this.UsuarioService.listarUsuarios();

        response.status(HttpStatus.OK).json({
            data: listaUsuarios
        })
    }

    @Get('/:id')
    async obtenerUsuario(@Param('id', MongoIdPipe) id, @Res() response: Response) {


        const usuario = await this.UsuarioService.listarUsuarioID(id);

        if (usuario) {
            response.status(HttpStatus.OK).json({
                data: usuario,
            });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'datos incorrectos',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }


    @Delete('/:id')
    async borradoLOgico(@Param('id', MongoIdPipe) id, @Res() response: Response) {
        const usuarioEliminado = await this.UsuarioService.borradoLogico(id);
        if (usuarioEliminado) {
            response.status(HttpStatus.OK).json({
                data: usuarioEliminado,
                messsage: 'usuario eliminado'
            });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Datos incorrectos',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

    }

}

