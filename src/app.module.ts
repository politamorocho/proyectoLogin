import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    DatabaseModule, 
    MongooseModule.forRoot(process.env.MONGODB_CONNECT), 
    // MongooseModule.forRoot(mongodb://127.0.0.1:27017/app_ccl, {
    //   useCreateIndex: true,
    //   useNewUrlParse: true
    // }),
    UsuarioModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
