import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioInterface } from 'src/usuario/usuario.interface';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly UsuarioService:UsuarioService,
        private readonly jwtService:JwtService
        )
    {}


    validarUsuario(email:string,claveUs:string):Promise<any>{
        const usuario=this.UsuarioService.validarUsuario(email, claveUs);

        if(!usuario) throw new UnauthorizedException();
        return usuario
  
}

login(usuario:UsuarioInterface ){
    const {_id, ...rest} = usuario;

    const payload={ sub:_id};

    return {
        ...rest,
        accessToken: this.jwtService.sign(payload)
    }

}

}
