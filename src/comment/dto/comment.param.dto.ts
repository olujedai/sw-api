import { ApiModelProperty } from '@nestjs/swagger';

export class CommentParamDto {
    @ApiModelProperty(
        {
            description: 'The movie ID to retrieve comments for',
            required: true,
            type: 'number',
        },
    )
    movieId: number;

}
