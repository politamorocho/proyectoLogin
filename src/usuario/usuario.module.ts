import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioSchema } from './usuario.schema';
import { UsuarioService } from './usuario.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RolModule } from '../rol/rol.module';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Usuario', schema: UsuarioSchema }]),
   RolModule],

  controllers: [UsuarioController],
  providers: [UsuarioService],
exports: [UsuarioService]

})
export class UsuarioModule { }
