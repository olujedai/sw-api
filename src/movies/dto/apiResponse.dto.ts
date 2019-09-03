// tslint:disable:variable-name

/**
 * Data Transfer Object for specifying the expected api response
 */
export class ApiResponseDto {
    readonly title: string;
    readonly episode_id: number;
    readonly opening_crawl: string;
    readonly director: string;
    readonly producer: string;
    readonly release_date: string;
    readonly characters: string[];
    readonly planets: string[];
    readonly starships: string[];
    readonly vehicles: string[];
    readonly species: string[];
    readonly created: string;
    readonly edited: string;
    readonly url: string;
}
