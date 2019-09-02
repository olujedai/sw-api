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

    async getCharacters(characters: string[], name, gender, height, order): Promise<CharactersDto> {
        const characterPromisesList = [];
        let characterList = [];
        characters.map(characterUrl => {
            const character = this.getCharacter(characterUrl);
            this.isObject(character) ? characterList.push(character) : characterPromisesList.push(character);
        });
        const resolvedPromisesList = await Promise.all(characterPromisesList);
        resolvedPromisesList.forEach((character) => {
            const characterUrl = character.url;
            this.requestService.storeInRedis(characterUrl, JSON.stringify(character));
        });
        characterList = characterList.concat(resolvedPromisesList);
        const allCharacters = characterList.map(character => this.retrieveFields(character));
        const movieCharacters = this.processCharacters(allCharacters, name, gender, height, order);
        return movieCharacters;
    }

    async getCharacter(characterUrl) {
        let character = await this.requestService.getFromRedis(characterUrl);
        if (character) {
            return JSON.parse(character);
        }
        character = this.requestService.fetchUrl(characterUrl);
        return character;
    }

    isObject(obj) {
        return obj !== undefined && obj !== null && obj.constructor === Object;
    }

    processCharacters(allCharacters, name, gender, height, order) {
        if (gender) {
            allCharacters = allCharacters.filter(character => this.filterByGender(character, gender));
        }
        if (name || gender ||  height || order) {
            allCharacters = this.sort(allCharacters, name, gender, height, order);
        }
        const totalNumberOfCharacters = allCharacters.length;
        const totalHeightInCm = this.calculateHeightInCm(allCharacters);
        const movieCharacters = this.prepareResponse(allCharacters, totalNumberOfCharacters, totalHeightInCm);
        return movieCharacters;
    }
    filterByGender(character: CharacterDto, gender: string) {
        return character.gender.toLowerCase() === gender.toLowerCase();
    }

    sort(allCharacters, name, gender, height, order) {
        if (name === 'true') {
            allCharacters = allCharacters.sort(this.utilsService.sortFunction('name', order));
        }
        if (gender) {
            allCharacters = allCharacters.sort(this.utilsService.sortFunction('gender', order));
        }
        if (height === 'true') {
            allCharacters = allCharacters.sort(this.utilsService.sortFunction('height', order));
        }
        return allCharacters;
    }

    formatGender(gender) {
        return gender.toLowerCase();
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
            gender: this.formatGender(character.gender),
            height: this.utilsService.isANumber(character.height) ? Number(character.height) : character.height,
        };
    }
}
