import { Injectable } from '@nestjs/common';
import { RequestService } from '../request/request.service';
import { CharacterDto } from './dto/character.dto';
import { CharactersDto } from './dto/characters.dto';
import { UtilsService } from '../utils/utils.service';
import { FeetDto } from './dto/feet.dto';
import { ApiResponseDto } from './dto/apiResponse.dto';

@Injectable()
export class CharacterService {
    constructor(
        private readonly requestService: RequestService,
        private readonly utilsService: UtilsService,
    ) {}

    async getCharacters(characters: string[], sort?: string, order?: string, filter?: string): Promise<CharactersDto> {
        /**
         * This method requests for characters from redis or from the remote url. An returns the processed characters to the caller
         * @param characters an array of character urls
         * @param sort the rule to be used for sorting the characters
         * @param order the order in which the characters should be sorted.
         * @param filter rule to indicate if the response should be filtered by gender
         * @returns an array of movie characters along with metadata indicating the total number of characters and their heights in
         * centimeters as well as feets and inches.
         */
        const characterPromisesList = [];
        characters.forEach(characterUrl => {
            const character = this.getCharacter(characterUrl);
            characterPromisesList.push(character);
        });
        const resolvedPromisesList = await Promise.all(characterPromisesList);
        const allCharacters = resolvedPromisesList.map(character => this.retrieveCharacterFields(character));
        const movieCharacters = this.processCharacters(allCharacters, sort, order, filter);
        return movieCharacters;
    }

    async getCharacter(characterUrl: string): Promise<CharacterDto> {
        /**
         * This method attempts to retrieve a character from the cache or from the remote url.
         * It returns a CharacterDto from redis or an object from the remote url if the remote request is successful, otherwise it returns null
         * @param characterUrl the url of the character. This is used as the key to the cache or the url to be retrieved by a remote request
         * @returns a character object defined by CharacterDto
         */
        let character = await this.requestService.getFromRedis(characterUrl);
        if (character) {
            return JSON.parse(character);
        }
        character = await this.requestService.fetchUrl(characterUrl);
        this.requestService.storeInRedis(characterUrl, JSON.stringify(character));
        return character;
    }

    processCharacters(allCharacters: CharacterDto[], sort?: string, order?: string, filter?: string): CharactersDto {
        /**
         * This method applies any sort or filter to all the characters and returns a response with metadata
         */
        if (filter) {
            allCharacters = allCharacters.filter(character => this.filterByGender(character, filter));
        }
        if (sort) {
            allCharacters = this.sort(allCharacters, sort, order);
        }
        const totalNumberOfCharacters = allCharacters.length;
        const totalHeightInCm = this.calculateHeightInCm(allCharacters);
        const movieCharacters = this.prepareResponse(allCharacters, totalNumberOfCharacters, totalHeightInCm);
        return movieCharacters;
    }

    filterByGender(character: CharacterDto, gender: string): boolean {
        return this.formatGender(character.gender) === this.formatGender(gender);
    }

    sort(allCharacters: CharacterDto[], sort: string, order?: string): CharacterDto[] {
        return allCharacters.sort(this.utilsService.sortFunction(sort, order));
    }

    formatGender(gender: string): string {
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

    convertCmToFeet(heightInCm: number): FeetDto {
        const realFeet = ((heightInCm * 0.393700) / 12);
        const feet = Math.floor(realFeet);
        const inches = Math.round((realFeet - feet) * 12);
        return {feet, inches};
    }

    formatFeet(heightInFeet: FeetDto): string {
        const {feet, inches} = heightInFeet;
        return `${feet}ft. ${inches}in.`;
    }

    prepareResponse(allCharacters: CharacterDto[], totalNumberOfCharacters: number, totalHeightInCm: number): CharactersDto {
        /*
        This method takes in an array of character objects (CharacterDto) and returns an object with characters and metadata
        */
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

    retrieveCharacterFields(character: ApiResponseDto): CharacterDto {
        /**
         * This method takes in a character object from an api and returns a character object in the format specified by the CharacterDto
         * @param character character object defined by ApiResponseDto
         * @returns a character object defined by CharacterDto
         */
        return {
            name: character.name,
            gender: this.formatGender(character.gender),
            height: this.utilsService.isANumber(character.height) ? Number(character.height) : null,
        };
    }
}
