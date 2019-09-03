import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

/**
 * Data Transfer Object that defines rules for documenting the query parameters on swagger UI
 * as well as the rules for validating the queries
 */
export class CharacterQueryDto {
    @ApiModelProperty(
        {
            description: 'Indicates how the characters will be sorted.',
            required: false,
            type: 'string',
            example: 'sort=gender',
            enum: ['height', 'name', 'gender'],
        },
    )
    @IsOptional()
    @IsIn(['height', 'name', 'gender'])
    sort?: 'height' | 'name' | 'gender';

    @ApiModelProperty(
        {
            description: 'Indicates how the characters will be ordered.',
            required: false,
            type: 'string',
            example: 'order=asc',
            enum: ['asc', 'desc'],
        },
    )
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';

    @ApiModelProperty(
        {
            description: 'Indicates the filter to be applied to the characters.',
            required: false,
            type: 'string',
            example: 'filter=male',
            enum: ['male', 'female', 'hermaphrodite', 'n/a', 'none'],
        },
    )
    @IsOptional()
    @IsIn(['male', 'female', 'hermaphrodite', 'n/a', 'none'])
    filter?: 'male' | 'female' | 'hermaphrodite' | 'n/a' | 'none';
}
