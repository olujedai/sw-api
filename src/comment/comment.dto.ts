import { ApiModelProperty } from '@nestjs/swagger';

export class CommentDto {
    @ApiModelProperty(
        {
            description: 'A movie viewer\'s comment',
            required: true,
            maxLength: 500,
            type: 'string',
        },
    )
    readonly comment: string;

    @ApiModelProperty(
        {
            description: 'The name of the user commenting',
            required: true,
            type: 'string',
        },
    )
    readonly commenter: string;
}
