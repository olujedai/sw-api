import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import * as fs from 'fs';

const characterJson = fs.readFileSync(`${__dirname}/static/oneCharacter.json`);
const character = JSON.parse(characterJson.toString());

const charactersJson = fs.readFileSync(`${__dirname}/static/characters.json`);
const characters = JSON.parse(charactersJson.toString());

let name = 'false';
let gender = 'male';
let height = 'false';
const order = 'asc';
let sort = 'false';
let filter = 'false';

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
        const response = characterService.processCharacters([character], name, gender, height, order, sort, filter);
        expect(response.characters[0].name).toBe(character.name);
        expect(response.characters[0].gender).toBe(characterService.getGender(character.gender));
        expect(response.characters[0].height).toBe(character.height);
    });

    it('should sort characters by name', () => {
        sort = 'true';
        gender = 'false';
        height = 'false';
        name = 'true';
        const response = characterService.processCharacters(characters, name, gender, height, order, sort, filter);
        expect(response.characters[characters.length - 1].name).toBe(character.name);
        expect(response.characters[0].name).toBe('C-3PO');
    });

    it('should sort characters by gender', () => {
        sort = 'true';
        gender = 'true';
        height = 'false';
        name = 'false';
        const response = characterService.processCharacters(characters, name, gender, height, order, sort, filter);
        expect(response.characters[0].name).toBe('Leia Organa');
    });

    it('should sort characters by height', () => {
        sort = 'true';
        height = 'true';
        name = 'false';
        gender = 'false';
        const response = characterService.processCharacters(characters, name, gender, height, order, sort, filter);
        expect(response.characters[0].name).toBe('Leia Organa');
    });

    it('should filter characters by gender', () => {
        gender = 'female';
        filter = 'true';
        const response = characterService.processCharacters(characters, name, gender, height, order, sort, filter);
        expect(response.characters[0].name).toBe('Leia Organa');
    });
});
