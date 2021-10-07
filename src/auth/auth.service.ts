import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioInterface } from 'src/usuario/usuario.interface';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly UsuarioService: UsuarioService,
        private readonly jwtService: JwtService
    ) { }


    async validarUsuario(correo: string, claveUsuario: string) {
       // console.log(correo, claveUsuario, 'del authservice');
        const usuario = await this.UsuarioService.validarUsuario(correo, claveUsuario);


        if (!usuario) {
            return false
        }


        //console.log(usuario, 'usuario que esta en el validar auth service')
        return usuario

    }

    async login(correo: string, claveUsuario: string) {

        const usuario = await this.validarUsuario(correo, claveUsuario);
        // console.log('login auth service', usuario);
        if (!usuario) {
            return false
        }

        const { _id, rol, ...resto } = usuario;
        // console.log('id:',_id);

        const payload= { sub: _id, rol};


        return {
            usuario,
            accessToken: this.jwtService.sign(payload),
        }

        // console.log(respuesta, 'del login auth serice')

    }

    // async generateAccessToken(name: string) {
    //     const user = await this.UsuarioService.listarUsuarioID(name);
    //     const payload = { userId: user._id};
    //     return {
    //       access_token: this.jwtService.sign(payload),
    //     };
    //   }


}
