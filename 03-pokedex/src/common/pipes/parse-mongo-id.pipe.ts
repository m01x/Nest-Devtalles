import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    
    if( !isValidObjectId(value)) { //si esto NO es un mongoId...
      throw new BadRequestException(`${value} is not a mongo Id.`);
    }
    
    // console.log({ value,metadata});

    return value;

  }
}
