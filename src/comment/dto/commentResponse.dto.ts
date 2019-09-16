import { ApiModelProperty } from '@nestjs/swagger';
import { CommentBodyDto } from './comment.dto';
/**
 * Comment Data Transfer Object for creating a new movie comment along with the swagger api definition and
 * field validations are defined here.
 */

export class CommentResponseDto {
    @ApiModelProperty(
        {
            description: 'The number of movie comments',
            type: 'number',
        },
    )
    readonly count: number;

    @ApiModelProperty(
        {
            description: 'An array of movie comments',
            type: [CommentBodyDto],
        },
    )
    readonly comments: CommentBodyDto[];
}
