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
             secretOrKey:'k14v3S3cR374',
         });
     }

     async validate (payload: any){
         const {sub:_id}=payload;

         return await this.UsuarioService.listarUsuarioID(_id)
     }

}