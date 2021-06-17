import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Corrections1623878459298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'correction',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'challenge_slug',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'difficulty',
            type: 'enum',
            enum: ['easy', 'normal', 'hard'],
          },
          {
            name: 'technology',
            type: 'varchar',
          },
          {
            name: 'rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
          },
          {
            name: 'points',
            type: 'int',
          },
          {
            name: 'total_tests',
            type: 'int',
          },
          {
            name: 'passed_tests',
            type: 'int',
          },
          {
            name: 'repository_url',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'CorrectionUserID',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('correction');
  }
}
