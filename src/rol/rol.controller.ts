import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Get,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

import { MongoIdPipe } from '../common/mongo-id.pipe';
import { ActualizarRolDto, RolDto } from './rol.dto';
import { RolService } from './rol.service';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  //  @UseGuards(JwtAuthGuard)
  @Post()
  async crearRol(
    @Body() rol: RolDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    const rolCreado = await this.rolService.crearRol(rol);
    if (rolCreado) {
      response.status(HttpStatus.OK).json({
        data: rolCreado,
        msg: 'rol creado con exito',
      });
    }
  }

  //  @UseGuards(JwtAuthGuard)
  //lista roles activos
  @Get()
  async listarRolActivo(@Res() response: Response) {
    const listaRoles = await this.rolService.listarRolesActivos();

    response.status(HttpStatus.OK).json({
      data: listaRoles,
    });
  }

  //  @UseGuards(JwtAuthGuard)
  //lista todos los roles activos e inactivos
  @Get('/all')
  async listarRol(@Res() response: Response) {
    const listaRoles = await this.rolService.listarTodos();

    response.status(HttpStatus.OK).json({
      data: listaRoles,
    });
  }

  //  @UseGuards(JwtAuthGuard)
  //muestra la info de un rol  por id
  @Get('/:id')
  async mostrarRol(@Param('id', MongoIdPipe) id, @Res() response: Response) {
    
    const perfilRol = await this.rolService.mostrarRol(id);
    if (perfilRol) {
      response.status(HttpStatus.OK).json({
        data: perfilRol,
        msg: 'informacion del rol',
      });
    }
  }

  //  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async actualizarRol(
    @Param('id', MongoIdPipe) id,
    @Body() rol: ActualizarRolDto,
    @Res() response: Response,
  ) {
    const rolAct = await this.rolService.actualizarRol(rol, id);
    if (rolAct) {
      response.status(HttpStatus.OK).json({
        data: rolAct,
        msg: 'rol actualizado con exito',
      });
    }
  }

  //  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async borrarRol(@Param('id', MongoIdPipe) id, @Res() response: Response) {
    const rolEliminado = await this.rolService.borradoLogico(id);
    if (rolEliminado) {
      response.status(HttpStatus.OK).json({
        data: rolEliminado.nombreRol,
        msg: 'rol eliminado con exito',
      });
    }
  }
}
