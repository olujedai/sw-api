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
            description: 'Sort response by character gender or filter the response by gender. \
            The sort and filter options must be true for this to work. The options are male, female, hemaphrodite, n/a and none',
            required: false,
            type: 'string',
            example: 'gender=female',
        },
    )
    gender: string;

    @ApiModelProperty(
        {
            description: 'Sort response by character height. \
            The sort option must be true for this to work.',
            required: false,
            type: 'string',
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
            description: 'Indicates if the response should be filtered. gender must be set and must be true.',
            required: true,
            type: 'boolean',
            default: false,
            example: 'filter=true',
        },
    )
    filter: string;
}
