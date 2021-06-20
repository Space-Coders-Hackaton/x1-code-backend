import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUserAddGithub1624177122092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'github',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.changeColumn(
      'user',
      'password',
      new TableColumn({
        name: 'password',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'password',
      new TableColumn({
        name: 'password',
        type: 'varchar',
      }),
    );

    await queryRunner.dropColumn('user', 'github');
  }
}
