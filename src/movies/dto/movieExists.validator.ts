import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { MoviesService } from '../movies.service';

/**
 * Custom validator that checks if a movieId exists
 */
@Injectable()
@ValidatorConstraint({ name: 'customText', async: false })
export class MovieExists implements ValidatorConstraintInterface {
    constructor(private readonly movieService: MoviesService) {}

    async validate(movieId: number, args: ValidationArguments): Promise<boolean> {
        const movie = await this.movieService.getMovie(movieId);
        return !!movie;
    }

    defaultMessage(args: ValidationArguments): string { // here you can provide default error message if validation failed
        return 'Invalid Movie ID';
    }

}
