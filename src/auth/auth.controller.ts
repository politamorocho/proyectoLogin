import { Controller, Post, Req, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsuarioInterface } from 'src/usuario/usuario.interface';
//import { UsuarioService } from 'src/usuario/usuario.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { LoginDTO } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) //  private readonly usuarioService: UsuarioService
  {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() req: LoginDTO) {
    const { correo, claveUsuario } = req;

    // const body = req.body;
    // console.log(req, 'del login');
    const data = await this.authService.login(correo, claveUsuario);
    // const{correo, claveUsuario}=req.Usuario;
    //  req.usuario

    //console.log(data);
    return data;
    // if (data) {
    //     return {
    //         msg: 'Se ha logeado correctamente',
    //         data
    //     }
    // }
  }

  //     @UseGuards(JwtAuthGuard)
  //     @Get('refresh')
  //   async refreshToken(@Req() req: UsuarioInterface) {
  //         const { correo, claveUsuario } = req;
  //         const data = await this.authService.login(correo, claveUsuario);

  //         if (data) {
  //             return {
  //                 msg: 'refresh exitoso',
  //                 data
  //             }
  //         }

  //     }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async obtenerPerfil() {}
}
