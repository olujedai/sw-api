import { ApiModelProperty } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsIn } from 'class-validator';

export class CharacterQueryDto {
    @ApiModelProperty(
        {
            description: 'If true, the characters will be sorted by name.',
            required: false,
            type: 'boolean',
            example: 'name=true',
        },
    )
    @IsOptional()
    @IsBooleanString()
    name?: 'true' | 'false';

    @ApiModelProperty(
        {
            description: 'If an option is selected, the characters will be filtered and sorted by that option.',
            required: false,
            type: 'string',
            example: 'gender=female',
            enum: ['male', 'female', 'hermaphrodite', 'n/a', 'none'],
        },
    )
    @IsOptional()
    @IsIn(['male', 'female', 'hermaphrodite', 'n/a', 'none'])
    gender?: 'male' | 'female' | 'hermaphrodite' | 'n/a' | 'none';

    @ApiModelProperty(
        {
            description: 'If true, the characters will be sorted by height.',
            required: false,
            type: 'boolean',
            example: 'height=true',
        },
    )
    @IsOptional()
    @IsBooleanString()
    height?: 'true' | 'false';

    @ApiModelProperty(
        {
            description: 'Indicates in the characters will be ordered in ascending or descending order.',
            required: false,
            type: 'string',
            example: 'order=asc',
            enum: ['asc', 'desc'],
        },
    )
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';
}
