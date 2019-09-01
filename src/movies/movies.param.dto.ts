import { ApiModelProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { MovieExists } from './movies.validator';

export class MovieParamDto {
    @ApiModelProperty(
        {
            description: 'The movie ID to retrieve the characters for',
            required: true,
            type: 'number',
        },
    )
    @Validate(MovieExists)
    movieId: number;
}
