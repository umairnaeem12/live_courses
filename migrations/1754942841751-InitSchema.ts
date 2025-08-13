import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1754942841751 implements MigrationInterface {
    name = 'InitSchema1754942841751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."course_material_kind_enum" AS ENUM('pdf', 'video', 'slide')`);
        await queryRunner.query(`CREATE TABLE "course_material" ("id" SERIAL NOT NULL, "s3Key" character varying NOT NULL, "kind" "public"."course_material_kind_enum" NOT NULL, "courseId" integer NOT NULL, CONSTRAINT "PK_f613a59407b9d91a2daccc0a636" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Streams" ("id" SERIAL NOT NULL, "muxLiveId" character varying, "playbackId" character varying, "streamKey" character varying, "playbackPolicy" character varying NOT NULL DEFAULT 'signed', "courseId" integer NOT NULL, CONSTRAINT "PK_916d9f4f6691a85b2c1f6894157" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Courses" ("id" SERIAL NOT NULL, "title" character varying(160) NOT NULL, "priceCents" integer NOT NULL, "instructorId" integer NOT NULL, CONSTRAINT "PK_e01ce00d3984a78d0693ab3ecbe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Instructors" ("id" SERIAL NOT NULL, "displayName" character varying(120) NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_3866b21d43a7d7ec087b566bdd" UNIQUE ("userId"), CONSTRAINT "PK_03a6515c86d02765b05724a59a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Users_role_enum" AS ENUM('student', 'instructor')`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."Users_role_enum" NOT NULL DEFAULT 'student', "instructorId" integer, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "REL_75ced83dc4e2913e21372c45dc" UNIQUE ("instructorId"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Purchases_status_enum" AS ENUM('pending', 'paid')`);
        await queryRunner.query(`CREATE TABLE "Purchases" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "courseId" integer NOT NULL, "status" "public"."Purchases_status_enum" NOT NULL DEFAULT 'pending', "providerSessionId" character varying, "providerChargeId" character varying, CONSTRAINT "UQ_d88ad73b2dacb056fc64ae58911" UNIQUE ("userId", "courseId", "providerSessionId"), CONSTRAINT "PK_00390719c1ac6a45d5c161d4d51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91b89ecfcc0e4f0997bb74639c" ON "Purchases" ("userId", "courseId") `);
        await queryRunner.query(`ALTER TABLE "course_material" ADD CONSTRAINT "FK_3b0e76dd3ad438a7efd302d64c0" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Streams" ADD CONSTRAINT "FK_67e0fcf20aad1a11e442a0175f1" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Courses" ADD CONSTRAINT "FK_daa091ecc2b35befb8c8d2b71d0" FOREIGN KEY ("instructorId") REFERENCES "Instructors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Instructors" ADD CONSTRAINT "FK_3866b21d43a7d7ec087b566bdd5" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_75ced83dc4e2913e21372c45dc3" FOREIGN KEY ("instructorId") REFERENCES "Instructors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Purchases" ADD CONSTRAINT "FK_e40aa39c6079bf1bfb6bcea3e38" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Purchases" ADD CONSTRAINT "FK_ec5fc631998ab0bf694f3a7d7d8" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Purchases" DROP CONSTRAINT "FK_ec5fc631998ab0bf694f3a7d7d8"`);
        await queryRunner.query(`ALTER TABLE "Purchases" DROP CONSTRAINT "FK_e40aa39c6079bf1bfb6bcea3e38"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_75ced83dc4e2913e21372c45dc3"`);
        await queryRunner.query(`ALTER TABLE "Instructors" DROP CONSTRAINT "FK_3866b21d43a7d7ec087b566bdd5"`);
        await queryRunner.query(`ALTER TABLE "Courses" DROP CONSTRAINT "FK_daa091ecc2b35befb8c8d2b71d0"`);
        await queryRunner.query(`ALTER TABLE "Streams" DROP CONSTRAINT "FK_67e0fcf20aad1a11e442a0175f1"`);
        await queryRunner.query(`ALTER TABLE "course_material" DROP CONSTRAINT "FK_3b0e76dd3ad438a7efd302d64c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91b89ecfcc0e4f0997bb74639c"`);
        await queryRunner.query(`DROP TABLE "Purchases"`);
        await queryRunner.query(`DROP TYPE "public"."Purchases_status_enum"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TYPE "public"."Users_role_enum"`);
        await queryRunner.query(`DROP TABLE "Instructors"`);
        await queryRunner.query(`DROP TABLE "Courses"`);
        await queryRunner.query(`DROP TABLE "Streams"`);
        await queryRunner.query(`DROP TABLE "course_material"`);
        await queryRunner.query(`DROP TYPE "public"."course_material_kind_enum"`);
    }

}
