import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMaterialTable1754968674240 implements MigrationInterface {
    name = 'UpdateMaterialTable1754968674240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."CourseMaterials_kind_enum" AS ENUM('pdf', 'video', 'slide')`);
        await queryRunner.query(`CREATE TABLE "CourseMaterials" ("id" SERIAL NOT NULL, "s3Key" character varying NOT NULL, "kind" "public"."CourseMaterials_kind_enum" NOT NULL, "originalName" character varying, "contentType" character varying, "courseId" integer NOT NULL, CONSTRAINT "PK_89ddb29fa50334d06cc5aa40591" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "CourseMaterials" ADD CONSTRAINT "FK_8ecd4023bf13b60a2807093164a" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CourseMaterials" DROP CONSTRAINT "FK_8ecd4023bf13b60a2807093164a"`);
        await queryRunner.query(`DROP TABLE "CourseMaterials"`);
        await queryRunner.query(`DROP TYPE "public"."CourseMaterials_kind_enum"`);
    }

}
