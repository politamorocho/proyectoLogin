import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly AuthService:AuthService
    ){
        super({
            usernameField:'correo',
            passwordField:'claveUsuario'
        })
    }

    async validate(correo:string, claveUsuario:string){
        const usuario = await this.AuthService.validarUsuario(correo,claveUsuario);
 
        
        if(!usuario) {
            throw new UnauthorizedException('no esta autorizado')
        };
        
       // console.log(usuario, 'del local strategy')
        return usuario
        
    }
}