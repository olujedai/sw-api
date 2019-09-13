import { ApiModelProperty } from '@nestjs/swagger';

export class CharacterDto {
    @ApiModelProperty(
        {
            description: 'The name of the character',
            type: 'string',
        },
    )
    readonly name: string;
    @ApiModelProperty(
        {
            description: 'The gender of the character',
            type: 'string',
        },
    )
    readonly gender: string;
    @ApiModelProperty(
        {
            description: 'The height of the character',
            type: 'number',
        },
    )
    readonly height: number | null;
}
