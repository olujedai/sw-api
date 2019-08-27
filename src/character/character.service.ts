import { Injectable } from '@nestjs/common';
import { RequestService } from '../request/request.service';
import { CharactersDto } from './characters.dto';

@Injectable()
export class CharacterService {
    constructor(private readonly requestService: RequestService) {}
    async getCharacters(characters: string[]): Promise<CharactersDto> {
        let characterList = [];
        characters.map(characterUrl => {
            characterList.push(this.requestService.fetchUrl(characterUrl));
        });
        characterList = await Promise.all(characterList);
        const allCharacters = characterList.map(character => this.retrieveFields(character));
        const totalCharacters = characterList.length;
        const numOr0 = n => isNaN(n) ? 0 : Number(n);
        let totalHeightInCm = 0;
        characterList.forEach(character =>
            totalHeightInCm += numOr0(character.height),
        );
        let movieCharacters;
        movieCharacters = {};
        movieCharacters.metadata = {
            total: totalCharacters,
            totalHeight: {
                cm: `${totalHeightInCm} cm`,
                feet: this.convertCmToFeet(totalHeightInCm),
            },
        };
        movieCharacters.characters = allCharacters;

        return movieCharacters;
    }

    retrieveFields(character) {
        return {
            name: character.name,
            gender: character.gender,
            height: character.height,
        };
    }

    convertCmToFeet(heightInCm) {
        const realFeet = ((heightInCm * 0.393700) / 12);
        const feet = Math.floor(realFeet);
        const inches = Math.round((realFeet - feet) * 12);
        return `${feet}ft. ${inches}in.`;
    }
}
