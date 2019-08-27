export class MovieDto {
    readonly id: number;
    readonly name: string;
    readonly releaseDate: Date;
    readonly openingCrawl: string;
    readonly characters: string[];
    commentCount: number;
}
