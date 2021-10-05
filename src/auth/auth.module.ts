import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsuarioModule } from '../usuario/usuario.module';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

require('dotenv').config()

@Module({
  imports:[PassportModule.register({defaultStrategy:'jwt'}),
         JwtModule.register({
          secret: 'k14v3S3cR374',
          signOptions:{expiresIn:'1h'}
    })
    ,UsuarioModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
