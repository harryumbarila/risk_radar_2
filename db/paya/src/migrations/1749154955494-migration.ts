/* eslint-disable class-methods-use-this */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1749154955494 implements MigrationInterface {
  public name = 'Migration1749154955494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tsys_fiu_file_variant_variant_type_enum" AS ENUM('PROVIDED', 'SUBMITTED', 'TSYS_RESPONSE')`
    );
    await queryRunner.query(
      `CREATE TABLE "tsys_fiu_file_variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_id" uuid NOT NULL, "downloader_user_name" character varying, "uploader_user_name" character varying, "variant_type" "public"."tsys_fiu_file_variant_variant_type_enum" NOT NULL, "s3_directory_path" character varying NOT NULL, "contents_hash" character varying NOT NULL, "valid_hash" boolean NOT NULL DEFAULT true, "uploader_ip" inet, "downloaded_at" TIMESTAMP WITH TIME ZONE, "downloader_ip" inet, "modified_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_a8940082417c5f8de406386c523" UNIQUE ("file_id", "variant_type"), CONSTRAINT "PK_5f5ac07e56d0cc1c3286e114717" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tsys_fiu_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "file_name" character varying NOT NULL, CONSTRAINT "PK_51aced5772278fee041997ec1a6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "tsys_fiu_file_variant" ADD CONSTRAINT "FK_88e9e962a71ddb408ceb88dc9d9" FOREIGN KEY ("file_id") REFERENCES "tsys_fiu_file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tsys_fiu_file_variant" DROP CONSTRAINT "FK_88e9e962a71ddb408ceb88dc9d9"`
    );
    await queryRunner.query(`DROP TABLE "tsys_fiu_file"`);
    await queryRunner.query(`DROP TABLE "tsys_fiu_file_variant"`);
    await queryRunner.query(
      `DROP TYPE "public"."tsys_fiu_file_variant_variant_type_enum"`
    );
  }
}
