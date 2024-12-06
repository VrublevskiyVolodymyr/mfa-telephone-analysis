import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1727636278338 implements MigrationInterface {
    name = ' $npmConfigName1727636278338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "name" character varying, "location" character varying, "emotionalTone" "public"."calls_emotionaltone_enum" NOT NULL, "text" text, "audioUrl" character varying NOT NULL, CONSTRAINT "PK_d9171d91f8dd1a649659f1b6a20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP(0) NOT NULL DEFAULT now(), "updated" TIMESTAMP(0) NOT NULL DEFAULT now(), "title" text NOT NULL, "points" text array NOT NULL DEFAULT ARRAY[]::text[], CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_calls" ("categoriesId" uuid NOT NULL, "callsId" uuid NOT NULL, CONSTRAINT "PK_123e523eac2900ba51d91bc4ba2" PRIMARY KEY ("categoriesId", "callsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0bb07b56e22e14ebab3f0e76b" ON "category_calls" ("categoriesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba29b28d5ceed4a0603f9774f6" ON "category_calls" ("callsId") `);
        await queryRunner.query(`ALTER TABLE "category_calls" ADD CONSTRAINT "FK_c0bb07b56e22e14ebab3f0e76b4" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_calls" ADD CONSTRAINT "FK_ba29b28d5ceed4a0603f9774f62" FOREIGN KEY ("callsId") REFERENCES "calls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_calls" DROP CONSTRAINT "FK_ba29b28d5ceed4a0603f9774f62"`);
        await queryRunner.query(`ALTER TABLE "category_calls" DROP CONSTRAINT "FK_c0bb07b56e22e14ebab3f0e76b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba29b28d5ceed4a0603f9774f6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0bb07b56e22e14ebab3f0e76b"`);
        await queryRunner.query(`DROP TABLE "category_calls"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "calls"`);
    }

}
