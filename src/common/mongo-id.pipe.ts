import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform {

  public transform(value: any, metadata: ArgumentMetadata) {
    if (!isMongoId(value)){
      throw new BadRequestException(`${value} no es un id e mongoDb valido`);
    }
    return value;
  }
}
