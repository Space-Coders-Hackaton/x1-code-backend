import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUserAddName1624015694481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'name');
  }
}
