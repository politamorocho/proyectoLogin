import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Res,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ActualizarUsuarioDto, UsuarioDto } from './usuario.dto';
import { UsuarioService } from './usuario.service';
import { MongoIdPipe } from '../common/mongo-id.pipe';
//import { IsMongoId, isMongoId } from 'class-validator';
import { UsuarioInterface } from 'src/usuario/usuario.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly UsuarioService: UsuarioService) {}

  @Post('/')
  async crearUsuario(@Body() usuario: UsuarioDto, @Res() response: Response) {
    const usuarioCreado = await this.UsuarioService.crearUsuario(usuario);
    if (usuarioCreado) {
      response.status(HttpStatus.OK).json({
        msg: 'usuario creado',
        data: usuarioCreado,
      });
    }
  }

  //@UseGuards(JwtAuthGuard)
  //lista usuarios activos
  @Get()
  async listarUsuarios(@Res() response: Response) {
    const listaUsuarios = await this.UsuarioService.listarUsuarios();

    response.status(HttpStatus.OK).json({
      data: listaUsuarios,
    });
  }

  //@UseGuards(JwtAuthGuard)
  //lista todos los usuarios activos e inactivos
  @Get('/all')
  async listarTodos(@Res() response: Response) {
    const listaUsuarios = await this.UsuarioService.listarTodos();

    response.status(HttpStatus.OK).json({
      data: listaUsuarios,
    });
  }

  @UseGuards(JwtAuthGuard)
  //obtiene perfil de usuario logeado
  @Get('/p')
  async obtenerPerfil(@Req() req: Request, @Res() response: Response) {
    const token = req.header('token-s');
    const { sub, rol } = jwt.verify(token, process.env.SECRET_KEY);

    const usuario = await this.UsuarioService.listarUsuarioID(sub);

    if (usuario) {
      response.status(HttpStatus.OK).json({
        data: usuario,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'El usuario requerido no existe hable con el admin',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //obtener cualquier usuario por id
  @Get('/:id')
  async obtenerUsuario(
    @Param('id', MongoIdPipe) id,
    @Res() response: Response,
  ) {
    const usuario = await this.UsuarioService.listarUsuarioID(id);

    if (usuario) {
      response.status(HttpStatus.OK).json({
        data: usuario,
      });
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'El usuario requerido no existe hable con el admin',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  //actualiza el perfil de usuario logeado
  @Put('/p')
  async actualizarPerfil(
    @Req() req: Request,
    @Body() usuario: ActualizarUsuarioDto,
    @Res() response: Response,
  ) {
    const token = req.header('token-s');
    const { sub, rol } = jwt.verify(token, process.env.SECRET_KEY);

    const usuarioAct = await this.UsuarioService.actualizarPerfil(usuario, sub);
    if (usuarioAct) {
      response.status(HttpStatus.OK).json({
        data: usuarioAct,
      });
    }
  }

  //actualiza cualquier usuario por id
  @Put('/:id')
  async actualizarUsuario(
    @Param('id', MongoIdPipe) id,
    @Body() usuario: ActualizarUsuarioDto,
    @Res() response: Response,
  ) {
    const usuarioAct = await this.UsuarioService.actualizarUsuario(usuario, id);
    if (usuarioAct) {
      response.status(HttpStatus.OK).json({
        data: usuarioAct,
      });
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async borradoLogico(@Param('id', MongoIdPipe) id, @Res() response: Response) {
    const usuarioEliminado = await this.UsuarioService.borradoLogico(id);
    if (usuarioEliminado) {
      response.status(HttpStatus.OK).json({
        data: usuarioEliminado.nombreUsuario,
        messsage: 'usuario eliminado',
      });
    }
  }

  // @UseGuards(JwtAuthGuard)
  //lista usuarios por rol
  @Get('/:rol')
  async listarUsuariosPorRol(
    @Param('rol') rol: string,
    @Res() response: Response,
  ) {
    // console.log(rol);
    const lista = await this.UsuarioService.listaUsuarioPorRol(rol);

    if (lista) {
      response.status(HttpStatus.OK).json({
        data: lista,
        messsage: 'listado obtenido',
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
