import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsuarioInterface } from "src/usuario/usuario.interface";
import { UsuarioService } from '../usuario/usuario.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
     constructor (
         private UsuarioService: UsuarioService,
     ){
         super({
             jwtFromRequest: ExtractJwt.fromHeader('token-s'),
             ignoreExpiration:false,
             secretOrKey:'k14v3S3cR374',
         });
     }

     async validate (payload: any): Promise<UsuarioInterface|boolean>{
         const {sub:_id,rol}=payload;

         const usuario= await this.UsuarioService.listarUsuarioID(_id)
         console.log(usuario)
         return usuario;
     }

}