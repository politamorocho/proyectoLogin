import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { RolSchema } from './rol.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Rol', schema: RolSchema }
    ]),
    ],

  providers: [RolService],
  controllers: [RolController],
  exports:[RolService]
  })
export class RolModule {}
