import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1754967123833 implements MigrationInterface {
    name = 'UpdateUserTable1754967123833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_75ced83dc4e2913e21372c45dc3"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "passwordHash"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "REL_75ced83dc4e2913e21372c45dc"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "instructorId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "name" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "password_hash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "email" character varying(180) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3c3ab3f49a87e6ddb607f3c494" ON "Users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3c3ab3f49a87e6ddb607f3c494"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "instructorId" integer`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "REL_75ced83dc4e2913e21372c45dc" UNIQUE ("instructorId")`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "passwordHash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_75ced83dc4e2913e21372c45dc3" FOREIGN KEY ("instructorId") REFERENCES "Instructors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
