import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolModule } from './rol/rol.module';


@Module({
  imports: [
    DatabaseModule, 
    // MongooseModule.forRoot(process.env.MONGODB_CONNECT), 
    MongooseModule.forRoot('mongodb+srv://usuario_db_1:keadkeb3r5Tr3z9N@cluster-usuario.jylct.mongodb.net/test?authSource=admin&replicaSet=atlas-czioze-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {
      // useCreateIndex: true,
      // useNewUrlParse: true
    }),
    UsuarioModule,
    AuthModule,
    RolModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
