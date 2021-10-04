import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsuarioService } from '../usuario/usuario.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
     constructor (
         private UsuarioService: UsuarioService,
     ){
         super({
             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
             ignoreExpiration:false,
             secretOrKey: process.env.SECRET_KEY,
         });
     }

     async validate (payload: any){
         const {sub:_id}=payload;

         return await this.UsuarioService.listarUsuarioID(_id)
     }

}