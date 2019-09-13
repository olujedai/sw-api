import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

/**
 * Comment Data Transfer Object for creating a new movie comment along with the swagger api definition and
 * field validations are defined here.
 */

export class CommentDto {
    @ApiModelProperty(
        {
            description: 'A movie viewer\'s comment',
            required: true,
            maxLength: 500,
            type: 'string',
        },
    )
    @IsNotEmpty()
    @Length(1, 500)
    readonly comment: string;

    @ApiModelProperty(
        {
            description: 'The name of the user commenting',
            required: true,
            type: 'string',
        },
    )
    @IsNotEmpty()
    @Length(1, 20)
    readonly commenter: string;
}
