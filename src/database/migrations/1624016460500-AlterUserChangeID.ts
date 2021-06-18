import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AlterUserChangeID1624016460500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'correction',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'user_role',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'user',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      }),
    );

    await queryRunner.createForeignKey(
      'user_role',
      new TableForeignKey({
        name: 'user_fk',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'correction',
      new TableForeignKey({
        name: 'user_fk',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'correction',
      new TableForeignKey({
        name: 'CorrectionUserID',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'id',
      new TableColumn({
        name: 'id',
        type: 'bigint',
        isGenerated: true,
        isPrimary: true,
        generationStrategy: 'increment',
      }),
    );

    await queryRunner.changeColumn(
      'user_role',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'bigint',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'correction',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'bigint',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'correction',
      new TableForeignKey({
        name: 'user_fk',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'correction',
      new TableForeignKey({
        name: 'CorrectionUserID',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }
}
