import { ValidationPipe, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';

export class ValidationPipe404 extends ValidationPipe {
    public async transform(value, metadata: ArgumentMetadata) {
      try {
        return await super.transform(value, metadata);
      } catch (e) {
        if (e instanceof BadRequestException) {
            if (e.message.message[0].property === 'movieId') {
                throw new NotFoundException(e.message.message);
            }
            throw new BadRequestException(e.message.message);
        }
      }
    }
}
