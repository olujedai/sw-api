import { ApiModelProperty } from '@nestjs/swagger';

export class CharacterQueryDto {
    @ApiModelProperty(
        {
            description: 'Sort characters by thier names. The sort option must be true for this to work.',
            required: false,
            type: 'boolean',
            example: 'name=true',
        },
    )
    name: boolean;

    @ApiModelProperty(
        {
            description: 'Sort response by character gender. \
            The sort option must be true for this to work.\
            When filter is true, a gender must be selected',
            required: false,
            type: 'string',
            example: 'gender=female',
            enum: ['male', 'female', 'hermaphrodite', 'n/a', 'none'],
        },
    )
    gender: string;

    @ApiModelProperty(
        {
            description: 'Sort response by character height. \
            The sort option must be true for this to work.',
            required: false,
            type: 'boolean',
            example: 'height=true',
        },
    )
    height: string;

    @ApiModelProperty(
        {
            description: 'Should the response be sorted in asceding or descending order. \
            The sort option must be true for this to work. Options are asc or desc.',
            required: false,
            type: 'string',
            example: 'order=asc',
            enum: ['asc', 'desc'],
        },
    )
    order: string;

    @ApiModelProperty(
        {
            description: 'Indicates if the response should be sorted or not.',
            required: true,
            type: 'boolean',
            default: false,
            example: 'sort=true',
        },
    )
    sort: string;

    @ApiModelProperty(
        {
            description: 'Indicates if the response should be filtered by gender.',
            required: true,
            type: 'boolean',
            default: false,
            example: 'filter=true',
        },
    )
    filter: string;
}
