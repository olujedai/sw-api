/**
 * Data Transfer Object that specifies the movie fields used in this application
 */
export class MovieDto {
    readonly id: number;  // The ID of the movie
    readonly name: string;  // The name of the movie
    readonly releaseDate: string;  // The date the movie was released
    readonly openingCrawl: string;  // The opening crawl of the movie
    readonly characters: string[];  // An array of the characters in the movie
    commentCount: number;  // The number of comments this movie has
}
