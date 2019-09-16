import { ApiModelProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { MovieValidator } from './movies.validator';

export class MovieParamDto {
    @ApiModelProperty(
        {
            description: 'The movie ID to retrieve the characters for',
            required: true,
            type: 'number',
        },
    )
    // @Validate(MovieValidator)
    movieId: number;
}
