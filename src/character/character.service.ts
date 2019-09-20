import { Injectable } from '@nestjs/common';
import { RequestService } from '../request/request.service';
import { CharacterDto } from './dto/character.dto';
import { CharactersDto } from './dto/characters.dto';
import { UtilsService } from '../utils/utils.service';
import { FeetDto } from './dto/feet.dto';
import { RemoteCharacterObjectDto } from './dto/apiResponse.dto';

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
        const resolvedPromisesList: RemoteCharacterObjectDto[] = await this.getCharactersFromUrls(characters);
        let allCharacters: CharacterDto[] = resolvedPromisesList.map(character => this.retrieveCharacterFields(character));
        allCharacters = this.applyCharacterSortAndFilter(allCharacters, sort, order, filter);
        return this.createCharacterResponseObject(allCharacters);
    }

    async getCharactersFromUrls(characters: string[]): Promise<RemoteCharacterObjectDto[]> {
        /**
         * This method requests for characters from redis or from the remote url.
         */
        const characterPromisesList = [];
        characters.forEach(characterUrl => {
            const character = this.getCharacter(characterUrl);
            characterPromisesList.push(character);
        });
        return await Promise.all(characterPromisesList);
    }

    async getCharacter(characterUrl: string): Promise<CharacterDto|string> {
        /**
         * This method attempts to retrieve a character from the cache or from the remote url.
         * It returns a CharacterDto from redis or an object from the remote url if the remote request is successful, otherwise it returns null
         * @param characterUrl the url of the character. This is used as the key to the cache or the url to be retrieved by a remote request
         * @returns a character object defined by CharacterDto
         */
        let character: string | CharacterDto;
        character = await this.requestService.getFromRedis(characterUrl);
        if (typeof(character) === 'string') {
            return JSON.parse(character);
        }
        character = await this.requestService.fetchUrl(characterUrl);
        this.requestService.storeInRedis(characterUrl, JSON.stringify(character));
        return character;
    }

    applyCharacterSortAndFilter(allCharacters: CharacterDto[], sort?: string, order?: string, filter?: string): CharacterDto[] {
        /**
         * This method applies any sort or filter to all the characters and returns a response with metadata
         */
        if (filter) {
            allCharacters = allCharacters.filter(character => this.filterMethod(character, filter));
        }
        if (sort) {
            allCharacters = this.sort(allCharacters, sort, order);
        }
        return allCharacters;
    }

    createCharacterResponseObject(allCharacters: CharacterDto[]): CharactersDto {
        const totalNumberOfCharacters: number = allCharacters.length;
        const totalHeightInCm: number = this.calculateHeightInCm(allCharacters);
        const movieCharacters: CharactersDto = this.getResponseFormat(allCharacters, totalNumberOfCharacters, totalHeightInCm);
        return movieCharacters;
    }

    filterMethod(character: CharacterDto, gender: string): boolean {
        return this.formatGender(character.gender) === this.formatGender(gender);
    }

    sort(allCharacters: CharacterDto[], sort: string, order?: string): CharacterDto[] {
        return allCharacters.sort(this.utilsService.sortFunction(sort, order));
    }

    formatGender(gender: string): string {
        return gender.toLowerCase();
    }

    calculateHeightInCm(characterList: CharacterDto[]): number {
        const numOr0 = (n: number) => isNaN(n) ? 0 : Number(n);
        let totalHeightInCm: number = 0;
        characterList.forEach((character: CharacterDto) =>
            totalHeightInCm += numOr0(character.height),
        );
        return totalHeightInCm;
    }

    convertCmToFeet(heightInCm: number): FeetDto {
        const realFeet: number = ((heightInCm * 0.393700) / 12);
        const feet: number = Math.floor(realFeet);
        const inches: number = Math.round((realFeet - feet) * 12);
        return {feet, inches};
    }

    formatFeet(heightInFeet: FeetDto): {feet: number, inches: number} {
        const {feet, inches} = heightInFeet;
        return {feet, inches};
    }

    getResponseFormat(allCharacters: CharacterDto[], totalNumberOfCharacters: number, totalHeightInCm: number): CharactersDto {
        /*
        This method takes in an array of character objects (CharacterDto) and returns an object with characters and metadata
        */
        return {
            metadata: {
                total: totalNumberOfCharacters,
                totalHeight: {
                    cm: `${totalHeightInCm}cm`,
                    feet: this.formatFeet(this.convertCmToFeet(totalHeightInCm)),
                },
            },
            characters: allCharacters,
        };
    }

    retrieveCharacterFields(character: RemoteCharacterObjectDto): CharacterDto {
        /**
         * This method takes in a character object from an api and returns a character object in the format specified by the CharacterDto
         * @param character character object defined by RemoteCharacterObjectDto
         * @returns a character object defined by CharacterDto
         */
        return {
            name: character.name,
            gender: this.formatGender(character.gender),
            height: this.utilsService.isANumber(character.height) ? Number(character.height) : null,
        };
    }
}
