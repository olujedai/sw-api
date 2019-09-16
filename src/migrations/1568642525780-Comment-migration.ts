import {MigrationInterface, QueryRunner} from 'typeorm';

export class CommentMigration1568642525780 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "commenter"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "commenter" character varying(20) NOT NULL`);
    }

}
