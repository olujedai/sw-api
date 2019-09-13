// tslint:disable:variable-name
import { RemoteMovieObjectDto } from './remoteMovie.dto';

/**
 * Data Transfer Object for specifying the expected api response
 */
export interface RemoteMoviesObjectDto {
    readonly id: number;
    readonly count: number;
    readonly next: null | boolean;
    readonly previous: null | boolean;
    readonly results: RemoteMovieObjectDto[];
}
