import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly UsuarioService:UsuarioService
    )
    {}


    validarUsuario(email:string,claveUs:string):Promise<any>{
        const usuario=this.UsuarioService.validarUsuario(email, claveUs);

        if(!usuario) throw new UnauthorizedException();
        return usuario

}
}
