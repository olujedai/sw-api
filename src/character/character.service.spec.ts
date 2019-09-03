import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import * as fs from 'fs';

const characterJson = fs.readFileSync(`${__dirname}/static/oneCharacter.json`);
const character = JSON.parse(characterJson.toString());

const charactersJson = fs.readFileSync(`${__dirname}/static/characters.json`);
const characters = JSON.parse(charactersJson.toString());

let order = 'asc';
let sort = 'name';
let filter = 'female';

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

    it('should return processedCharacters', () => {
        order = undefined;
        sort = undefined;
        filter = undefined;
        const response = characterService.processCharacters([character], sort, order, filter);
        expect(response.characters[0].name).toBe(character.name);
        expect(response.characters[0].gender).toBe(characterService.formatGender(character.gender));
        expect(response.characters[0].height).toBe(character.height);
    });

    it('should sort characters by name', () => {
        sort = 'name';
        const response = characterService.processCharacters(characters, sort, order, filter);
        expect(response.characters[characters.length - 1].name).toBe(character.name);
        expect(response.characters[0].name).toBe('C-3PO');
    });

    it('should sort characters by gender', () => {
        sort = 'gender';
        const response = characterService.processCharacters(characters, sort, order, filter);
        expect(response.characters[0].name).toBe('Leia Organa');
    });

    it('should sort characters by height', () => {
        sort = 'height';
        const response = characterService.processCharacters(characters, sort, order, filter);
        expect(response.characters[0].name).toBe('Leia Organa');
    });

    it('should filter characters by gender', () => {
        filter = 'female';
        const response = characterService.processCharacters(characters, sort, order, filter);
        expect(response.characters[0].name).toBe('Leia Organa');
    });
});
