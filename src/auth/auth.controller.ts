import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioInterface } from 'src/usuario/usuario.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {


constructor(
    private readonly authService: AuthService
){}

    @UseGuards(AuthGuard('local'), AuthGuard('jwt'))
    @Post('/login')
    async login(@Req() req:UsuarioInterface) {

        const data= await this.authService.login(req);
       // const{correo, claveUsuario}=req.Usuario;
      //  req.usuario

      return { msg: 'si se pudo login'}
    }




}
