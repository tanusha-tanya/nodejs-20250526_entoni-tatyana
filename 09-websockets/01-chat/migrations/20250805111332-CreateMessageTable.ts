import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessageTable20250805111332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE message (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            username TEXT NOT NULL,
            date DATETIME NOT NULL
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE message
    `);
  }
} 