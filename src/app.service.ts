import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIsAlive(): string {
    return 'This server is up';
  }
}
