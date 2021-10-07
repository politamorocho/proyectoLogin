import { Body, Controller, HttpException, HttpStatus, Post, Req, Res, UseGuards, Get, Param, Delete, Put } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

import { MongoIdPipe } from '../common/mongo-id.pipe';
import { RolDto } from './rol.dto';
import { RolService } from './rol.service';

@Controller('rol')
export class RolController {

    constructor(private readonly rolService: RolService) { }

    //  @UseGuards(JwtAuthGuard)
    @Post('/')
    async crearRol(@Body() rol: RolDto, @Req() req: Request, @Res() response: Response) {
        //   const {_id} = req.usuario;

        //const tipoUsuario =req.usuarioInterface._id
        const rolCreado = await this.rolService.crearRol(rol);
        if (rolCreado) {

            response.status(HttpStatus.OK).json({
                data: rolCreado,
            });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'el rol ya existe',
                },
                HttpStatus.BAD_REQUEST,
            );
        }


    }
    //  @UseGuards(JwtAuthGuard)
    //lista roles activos
    @Get('/')
    async listarRolActivo(@Res() response: Response) {
        const listaRoles = await this.rolService.listarRolesActivos();

        response.status(HttpStatus.OK).json({
            data: listaRoles
        })
    }


//  @UseGuards(JwtAuthGuard)
//lista todos los roles activos e inactivos
    @Get('/all')
    async listarRol(@Res() response: Response) {
        const listaRoles = await this.rolService.listarTodos();

        response.status(HttpStatus.OK).json({
            data: listaRoles
        })
    }


    //  @UseGuards(JwtAuthGuard)
    //muestra la info de un rol  por id
    @Get('/:id')
    async mostrarRol(@Param('id', MongoIdPipe) id, @Res() response: Response) {
        const perfilRol = await this.rolService.mostrarRol(id);

        response.status(HttpStatus.OK).json({
            data: perfilRol
        })
    }


    //  @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async actualizarRol(@Param('id', MongoIdPipe) id, @Body() rol: RolDto, @Res() response: Response){
        const rolAct= await this.rolService.actualizarRol(rol, id);

        if(rolAct){
            response.status(HttpStatus.OK).json({
                data: rolAct,
              });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'El rol requerido no existe hable con el admin',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

    }


    //  @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async borrarRol(@Param('id', MongoIdPipe) id, @Res() response: Response) {
        const rolEliminado = await this.rolService.borradoLogico(id);
        if (rolEliminado) {
            response.status(HttpStatus.OK).json({
                data: rolEliminado,
                messsage: 'rol eliminado'
            });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Datos incorrectos - no se eliminó el rol',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

    }

    

    // @Post('/verificar')
    // async verificar(@Body() nombreRol: string, @Res() response: Response) {

    //     const nombrol = await this.rolService.verificaSiExisteRol(nombreRol);
        
    //     if (nombrol) {
    //         response.status(HttpStatus.OK).json({
    //             data: nombrol,
    //             messsage: 'rol existe'
    //         });
    //     } else {
    //         throw new HttpException(
    //             {
    //                 status: HttpStatus.BAD_REQUEST,
    //                 error: 'no existe el rol',
    //             },
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }

    // }

}
