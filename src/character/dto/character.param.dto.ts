import { ApiModelProperty } from '@nestjs/swagger';

export class CharacterParamDto {
    @ApiModelProperty(
        {
            description: 'The movie ID to retrieve the characters for',
            required: true,
            type: 'number',
        },
    )
    movieId: number;

}
