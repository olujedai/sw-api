import { Meta } from './characterMeta.dto';
import { CharacterDto } from './character.dto';

/**
 * Data transfer object for describing the character response object
 */
export class CharactersDto {
    readonly metadata: Meta;
    readonly characters: CharacterDto;
}
