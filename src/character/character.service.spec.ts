import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import * as fs from 'fs';
import { CharacterDto } from './dto/character.dto';
import { CharactersDto } from './dto/characters.dto';
import { FeetDto } from './dto/feet.dto';

const characterJson = fs.readFileSync(`${__dirname}/static/oneCharacter.json`);
const character = JSON.parse(characterJson.toString());

const charactersJson = fs.readFileSync(`${__dirname}/static/characters.json`);
const characters = JSON.parse(charactersJson.toString());

const processedCharactersJson = fs.readFileSync(`${__dirname}/static/processedCharacters.json`);
const processedCharacters = JSON.parse(processedCharactersJson.toString());

const order = 'asc';
let sort = 'name';
let filter = null;

describe('CharacterService', () => {
    let characterService: CharacterService;
    let requestService: RequestService;
    let utilsService: UtilsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [CharacterService, RequestService, UtilsService],
        }).compile();

        characterService = module.get<CharacterService>(CharacterService);
        requestService = module.get<RequestService>(RequestService);
        utilsService = module.get<UtilsService>(UtilsService);
    });

    it('should be defined', () => {
        expect(characterService).toBeDefined();
        expect(requestService).toBeDefined();
        expect(utilsService).toBeDefined();
    });

    it('should sort characters by name', () => {
        sort = 'name';
        const response: CharacterDto[] = characterService.applyCharacterSortAndFilter(characters, sort, order, filter);
        expect(response[characters.length - 1].name).toBe(character.name);
        expect(response[0].name).toBe('C-3PO');
    });

    it('should sort characters by gender', () => {
        sort = 'gender';
        const response: CharacterDto[] = characterService.applyCharacterSortAndFilter(characters, sort, order, filter);
        expect(response[0].name).toBe('Leia Organa');
    });

    it('should sort characters by height', () => {
        sort = 'height';
        const response: CharacterDto[] = characterService.applyCharacterSortAndFilter(characters, sort, order, filter);
        expect(response[0].name).toBe('Leia Organa');
    });

    it('should filter characters by gender', () => {
        filter = 'female';
        const response: CharacterDto[] = characterService.applyCharacterSortAndFilter(characters, sort, order, filter);
        expect(response[0].name).toBe('Leia Organa');
    });

    it('should retrieve the character fields we are concerned with', () => {
        const response: CharacterDto = characterService.retrieveCharacterFields(character);
        expect(response).toEqual({ name: 'Luke Skywalker', gender: 'male', height: 172 });
    });

    it('should convert centimeters to feet', () => {
        const response: FeetDto = characterService.convertCmToFeet(184);
        expect(response).toEqual({ feet: 6, inches: 0 });
    });

    it('should calculate the height of all the characters in centimeters', () => {
        const characterList: CharacterDto[] = characters.map(ch => characterService.retrieveCharacterFields(ch));
        const response: number = characterService.calculateHeightInCm(characterList);
        expect(response).toBe(664);
    });

    it('should return the height in feet in the required format', () => {
        const response: string = characterService.formatFeet({ feet: 6, inches: 0 });
        expect(response).toEqual('6ft. 0in.');
    });

    it('should return the characters in the required format', () => {
        filter = 'female';
        const sortedAndFIlteredCharacters: CharacterDto[] = characterService.applyCharacterSortAndFilter(characters, sort, order, filter);
        const response: CharactersDto = characterService.getResponseFormat(sortedAndFIlteredCharacters, sortedAndFIlteredCharacters.length, 200);
        expect(response.metadata).toEqual({ total: 1, totalHeight: { cm: '200cm', feet: '6ft. 7in.' }});
    });

    it('should convert a gender string to lowercase', () => {
        let response: string = characterService.formatGender('MALE');
        expect(response).toBe('male');
        response = characterService.formatGender('fEmaLE');
        expect(response).toBe('female');
    });

    it('should return true for characters that fit a given gender and false otherwise', () => {
        let response: boolean = characterService.filterMethod(character, 'male');
        expect(response).toBe(true);
        response = characterService.filterMethod(character, 'female');
        expect(response).toBe(false);
    });

    it('should return a list of processed characters', async () => {
        // jest.spyOn(characterService, 'getCharacters').mockResolvedValue(processedMovies);
        jest.spyOn(characterService, 'getCharactersFromUrls').mockResolvedValue(characters);
        const characterUrls: string[] =  [
            'https://swapi.co/api/people/1/',
            'https://swapi.co/api/people/2/',
            'https://swapi.co/api/people/3/',
            'https://swapi.co/api/people/4/',
        ];
        const response: CharactersDto = await characterService.getCharacters(characterUrls);
        expect(response).toEqual(processedCharacters);
    });

    it('should return one character', async () => {
        jest.spyOn(characterService, 'getCharacter').mockResolvedValue(character);
        const response: string | CharacterDto = await characterService.getCharacter('https://swapi.co/api/people/1/');
        expect(response).toEqual(character);
    });
});
