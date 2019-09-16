import { ApiModelProperty } from '@nestjs/swagger';

export class MovieParamDto {
    @ApiModelProperty(
        {
            description: 'The movie ID to retrieve the characters for',
            required: true,
            type: 'number',
        },
    )
    movieId: number;
}
