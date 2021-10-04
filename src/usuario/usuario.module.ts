import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioSchema } from './usuario.schema';
import { UsuarioService } from './usuario.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Usuario', schema: UsuarioSchema }
    ]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
exports: [UsuarioService]

})
export class UsuarioModule { }
