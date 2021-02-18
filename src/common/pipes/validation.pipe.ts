import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(Id: string) {
    const IntId = parseInt(Id, 10);
    if (isNaN(IntId)) {
      throw new BadRequestException('id가 올바르지 않습니다.');
    }
    return IntId;

    //return Number(Id);
  }
}
