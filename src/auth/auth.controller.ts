import { Controller, Post, Req, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioInterface } from 'src/usuario/usuario.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@Controller('auth')
export class AuthController {


    constructor(
        private readonly authService: AuthService
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Body() req: UsuarioInterface) {

        const { correo, claveUsuario } = req;

        // const body = req.body;
        // console.log(req, 'del login');
        const data = await this.authService.login(correo, claveUsuario);
        // const{correo, claveUsuario}=req.Usuario;
        //  req.usuario

        if (data) {
            return {
                msg: 'Se ha logeado correctamente',
                data
            }
        }
    }


    @UseGuards(JwtAuthGuard)
    @Get('refresh')
  async refreshToken(@Req() req: UsuarioInterface) {
        const { correo, claveUsuario } = req;
        const data = await this.authService.login(correo, claveUsuario);

        if (data) {
            return {
                msg: 'refresh exitoso',
                data
            }
        }
        
    }


    @UseGuards(JwtAuthGuard)
    @Get('perfil')
    async obtenerPerfil(@Req() usuario:UsuarioInterface) {
       const usuario2= JSON.stringify(usuario);
        return {
            message: 'tus datos son:',
            usuario2
        }
    }






}
