import { Meta } from './characterMeta.dto';
import { CharacterDto } from './character.dto';
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Data transfer object for describing the character response object
 */
export class CharactersDto {
    @ApiModelProperty(
        {
            description: 'Response metadata',
            type: Meta,
        },
    )
    readonly metadata: Meta;
    @ApiModelProperty(
        {
            description: 'List of characters',
            type: CharacterDto,
        },
    )
    readonly characters: CharacterDto[];
}
