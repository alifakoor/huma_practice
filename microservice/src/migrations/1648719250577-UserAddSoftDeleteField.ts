import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAddSoftDeleteField1648719250577 implements MigrationInterface {
    name = 'UserAddSoftDeleteField1648719250577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isDeleted"`);
    }

}
