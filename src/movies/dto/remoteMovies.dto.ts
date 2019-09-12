// tslint:disable:variable-name
import { RemoteMovieObjectDto } from './remoteMovie.dto';

/**
 * Data Transfer Object for specifying the expected api response
 */
export class RemoteMoviesObjectDto {
    readonly count: number;
    readonly next: null | boolean;
    readonly previous: null | boolean;
    readonly results: RemoteMovieObjectDto[];
}
