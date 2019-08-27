import { Meta } from './characterMeta.dto';
import { CharacterDto } from './character.dto';

export class CharactersDto {
    readonly metadata: Meta;
    readonly characters: CharacterDto;
}
