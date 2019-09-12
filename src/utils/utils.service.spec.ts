import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';

const objectArr: Array<{date: string}> = [
  {
    date: '2037-05-25',
  },
  {
    date: '1987-05-25',
  },
  {
    date: '1977-05-25',
  },
  {
    date: '1997-05-25',
  },
];

const request: {headers: object, connection: {remoteAddress: string}, socket: {remoteAddress: string}} = {
  headers: {
      'x-forwarded-for': '192.168.0.0',
  },
  connection: {
      remoteAddress: '192.168.0.1',
  },
  socket: {
      remoteAddress: '192.168.0.2',
  },
};

describe('UtilsService', () => {
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilsService],
    }).compile();

    utilsService = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(utilsService).toBeDefined();
  });

  it('should not sort array of objects in ascending order', () => {
    objectArr.sort(utilsService.sortFunction('releaseDate'));
    expect(objectArr[0].date).toBe('2037-05-25');
    expect(objectArr[objectArr.length - 1].date).toBe('1997-05-25');
  });

  it('should not sort array of objects in descending order', () => {
    objectArr.sort(utilsService.sortFunction('releaseDate', 'desc'));
    expect(objectArr[0].date).toBe('2037-05-25');
    expect(objectArr[objectArr.length - 1].date).toBe('1997-05-25');
  });

  it('should sort array of objects in ascending order', () => {
    objectArr.sort(utilsService.sortFunction('date'));
    expect(objectArr[0].date).toBe('1977-05-25');
    expect(objectArr[objectArr.length - 1].date).toBe('2037-05-25');
  });

  it('should sort array of objects in descending order', () => {
    objectArr.sort(utilsService.sortFunction('date', 'desc'));
    expect(objectArr[0].date).toBe('2037-05-25');
    expect(objectArr[objectArr.length - 1].date).toBe('1977-05-25');
  });

  it('returns that the passed in argument is a number', () => {
    expect(utilsService.isANumber('1')).toBe(true);
    expect(utilsService.isANumber(5)).toBe(true);
  });

  it('returns that the passed in argument is not a number', () => {
    expect(utilsService.isANumber('this')).toBe(false);
    expect(utilsService.isANumber('that')).toBe(false);
  });

  it('should return the ipaddress in the x-forwarded-for header', () => {
    // @ts-ignore
    expect(utilsService.getIpAddress(request)).toBe('192.168.0.0');
  });

  it('should return the ipaddress in request.connection.remoteAddress', () => {
    delete request.headers['x-forwarded-for'];
    // @ts-ignore
    expect(utilsService.getIpAddress(request)).toBe('192.168.0.1');
  });

  it('should return the ipaddress in request.socket.remoteAddress', () => {
    delete request.headers['x-forwarded-for'];
    delete request.connection.remoteAddress;
    // @ts-ignore
    expect(utilsService.getIpAddress(request)).toBe('192.168.0.2');
  });

  it('should return an empty string as the ipaddress', () => {
    delete request.headers['x-forwarded-for'];
    delete request.connection.remoteAddress;
    delete request.socket.remoteAddress;
    // @ts-ignore
    expect(utilsService.getIpAddress(request)).toBe('');
  });
});
