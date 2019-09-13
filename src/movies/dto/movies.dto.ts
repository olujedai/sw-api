import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object that specifies the movie fields used in this application
 */
export class MovieDto {
    @ApiModelProperty(
        {
            description: 'The ID of the movie',
            type: 'number',
        },
    )
    readonly id: number;
    @ApiModelProperty(
        {
            description: 'The name of the movie',
            type: 'string',
        },
    )
    readonly name: string;
    @ApiModelProperty(
        {
            description: 'The date the movie was released',
            type: 'string',
        },
    )
    readonly releaseDate: string;
    @ApiModelProperty(
        {
            description: 'The opening crawl of the movie',
            type: 'string',
        },
    )
    readonly openingCrawl: string;
    @ApiModelProperty(
        {
            description: 'An array of the character urls',
            type: 'string',
        },
    )
    readonly characters: string[];
    @ApiModelProperty(
        {
            description: 'The number of comments the movie has',
            type: 'number',
        },
    )
    commentCount: number;
}
