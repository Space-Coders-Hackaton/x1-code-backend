import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterCorrectionsChangeRating1624118777327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'correction',
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'decimal',
        precision: 4,
        scale: 2,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'correction',
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'decimal',
        precision: 3,
        scale: 2,
      }),
    );
  }
}
