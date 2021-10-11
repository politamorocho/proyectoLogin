import { Controller, Get, HttpException, HttpStatus, Post, Body, Res, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { UsuarioDto } from './usuario.dto';
import { UsuarioService } from './usuario.service';
import { MongoIdPipe } from '../common/mongo-id.pipe';
//import { IsMongoId, isMongoId } from 'class-validator';
import { UsuarioInterface } from 'src/usuario/usuario.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');


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
                    error: 'correo ya registrado o rol no permitido',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

    }

    @UseGuards(JwtAuthGuard)
    //lista usuarios activos
    @Get('/')
    async listarUsuarios(@Res() response: Response) {

        const listaUsuarios = await this.UsuarioService.listarUsuarios();

        response.status(HttpStatus.OK).json({
            data: listaUsuarios
        })
    }

    
    @UseGuards(JwtAuthGuard)
    //lista todos los usuarios activos e inactivos
    @Get('/todos')
    async listarTodos(@Res() response: Response) {

        const listaUsuarios = await this.UsuarioService.listarTodos();

        response.status(HttpStatus.OK).json({
            data: listaUsuarios
        })
    }



    @UseGuards(JwtAuthGuard)
    //muestra los datos de un usuario por id
    @Get('/one')
    async obtenerUsuario(@Req() req: Request,  @Res() response: Response) {

        const token= req.header('token-s');
        const { sub, rol } = jwt.verify(token, process.env.SECRET_KEY)
        

        const usuario = await this.UsuarioService.listarUsuarioID(sub);

        if (usuario) {
            response.status(HttpStatus.OK).json({
                data: usuario,
            });
        } else {
            throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'El usuario requerido no existe hable con el admin',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('/')
    async actualizarUsuario(@Req() req: Request, @Body() usuario: UsuarioDto, @Res() response: Response){

        const token= req.header('token-s');
        const { sub, rol } = jwt.verify(token, process.env.SECRET_KEY)
        
        const usuarioAct= await this.UsuarioService.actualizarUsuario(usuario, sub);
        if(usuarioAct){
            response.status(HttpStatus.OK).json({
                data: usuarioAct,
              });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'El usuario requerido no existe o el correo ya esta siendo usado',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

    }

    @UseGuards(JwtAuthGuard)
    @Delete('/')
    async borradoLogico(@Req() req: Request, @Res() response: Response) {

        const token= req.header('token-s');
        const { sub, rol } = jwt.verify(token, process.env.SECRET_KEY)
        

        const usuarioEliminado = await this.UsuarioService.borradoLogico(sub);
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

   // @UseGuards(JwtAuthGuard)
    //lista usuarios por rol
    @Get('/:rol')
    async listarUsuariosPorRol(@Param('rol') rol: string, @Res() response: Response){
       // console.log(rol);
        const lista = await this.UsuarioService.listaUsuarioPorRol(rol);

        if (lista) {
            response.status(HttpStatus.OK).json({
                data: lista,
                messsage: 'listado obtenido'
            });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'no se pudo obtener la lista',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }




}

