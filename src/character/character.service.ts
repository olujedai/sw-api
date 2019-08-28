import { Injectable } from '@nestjs/common';
import { RequestService } from '../request/request.service';
import { CharacterDto } from './character.dto';
import { CharactersDto } from './characters.dto';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class CharacterService {
    constructor(
        private readonly requestService: RequestService,
        private readonly utilsService: UtilsService,
    ) {}

    async getCharacters(characters: string[], name, gender, height, order, sort, filter): Promise<CharactersDto> {
        let characterList = [];
        characters.map(characterUrl => {
            characterList.push(this.requestService.fetchUrl(characterUrl));
        });
        characterList = await Promise.all(characterList);
        const allCharacters = characterList.map(character => this.retrieveFields(character));
        const movieCharacters = this.processCharacters(allCharacters, name, gender, height, order, sort, filter);
        return movieCharacters;
    }

    processCharacters(allCharacters, name, gender, height, order, sort, filter) {
        if (filter === 'true') {
            allCharacters = allCharacters.filter(character => this.filterByGender(character, gender));
        }
        if (sort === 'true') {
            allCharacters = this.sort(allCharacters, name, gender, height, order);
        }
        const totalNumberOfCharacters = allCharacters.length;
        const totalHeightInCm = this.calculateHeightInCm(allCharacters);
        const movieCharacters = this.prepareResponse(allCharacters, totalNumberOfCharacters, totalHeightInCm);
        return movieCharacters;
    }
    filterByGender(character: CharacterDto, gender: string) {
        return character.gender === this.getGender(gender);
    }

    sort(allCharacters, name, gender, height, order) {
        if (name === 'true') {
            return allCharacters.sort(this.utilsService.sortFunction('name', order));
        }
        if (gender === 'true') {
            return allCharacters.sort(this.utilsService.sortFunction('gender', order));
        }
        if (height === 'true') {
            return allCharacters.sort(this.utilsService.sortFunction('height', order));
        }
        return allCharacters;
    }
    getGender(gender) {
        if (gender.toLowerCase() === 'male') {
            return 'male';
        }
        if (gender.toLowerCase() === 'female') {
            return 'female';
        }

        if (gender.toLowerCase() === 'hermaphrodite') {
            return 'hermaphrodite';
        }

        if (gender.toLowerCase() === 'n/a') {
            return 'n/a';
        }

        if (gender.toLowerCase() === 'none') {
            return 'none';
        }
        return null;
    }

    calculateHeightInCm(characterList: CharacterDto[]): number {
        const numOr0 = n => isNaN(n) ? 0 : Number(n);
        let totalHeightInCm = 0;
        characterList.forEach(character =>
            totalHeightInCm += numOr0(character.height),
        );
        return totalHeightInCm;
    }

    convertCmToFeet(heightInCm) {
        const realFeet = ((heightInCm * 0.393700) / 12);
        const feet = Math.floor(realFeet);
        const inches = Math.round((realFeet - feet) * 12);
        return {feet, inches};
    }

    formatFeet(heightInFeet) {
        const {feet, inches} = heightInFeet;
        return `${feet}ft. ${inches}in.`;
    }

    prepareResponse(allCharacters: CharacterDto[], totalNumberOfCharacters: number, totalHeightInCm: number): CharactersDto {
        let movieCharacters;
        movieCharacters = {};
        movieCharacters.metadata = {
            total: totalNumberOfCharacters,
            totalHeight: {
                cm: `${totalHeightInCm}cm`,
                feet: this.formatFeet(this.convertCmToFeet(totalHeightInCm)),
            },
        };
        movieCharacters.characters = allCharacters;
        return movieCharacters;
    }

    retrieveFields(character) {
        return {
            name: character.name,
            gender: this.getGender(character.gender),
            height: this.utilsService.isANumber(character.height) ? Number(character.height) : character.height,
        };
    }
}
