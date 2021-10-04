import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioService } from './usuario/usuario.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [DatabaseModule, MongooseModule.forRoot(process.env.MONGODB_CONNECT), UsuarioModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, UsuarioService],
})
export class AppModule {}
