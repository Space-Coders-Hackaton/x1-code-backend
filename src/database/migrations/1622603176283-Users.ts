import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

const defaultUser = 'admin@email.com';
const defaultPass = '$2a$08$2fIEQty0rtpfO5hGLrXZbefjy8Lh5OFVNx../FnYS05mTzwKwkTVq';
// DEFAULT PASS !123A123b
export class Users1622603176283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          { name: 'id', type: 'bigint', isGenerated: true, isPrimary: true, generationStrategy: 'increment' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          { name: 'id', type: 'bigint', isGenerated: true, isPrimary: true, generationStrategy: 'increment' },
          { name: 'name', type: 'varchar' },
          { name: 'initials', type: 'varchar', isUnique: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_role',
        columns: [
          { name: 'user_id', type: 'bigint', isNullable: true },
          { name: 'role_id', type: 'bigint', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKeys('user_role', [
      new TableForeignKey({
        name: 'user_fk',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'role_fk',
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);

    await queryRunner.query(`
      INSERT INTO "role"
          (name, initials)
      VALUES
          ('Administrador', 'ADM'),
          ('Usuario', 'USER')
    `);

    await queryRunner.query(`
      INSERT INTO "user"
          (email, "password")
      VALUES
          ('${defaultUser}', '${defaultPass}')
    `);

    await queryRunner.query(`
      INSERT INTO "user_role"
          ("user_id", "role_id")
      VALUES
          (
              (SELECT id FROM "user" WHERE email = '${defaultUser}'),
              (SELECT id FROM "role" WHERE initials = 'ADM')
          ),(
              (SELECT id FROM "user" WHERE email = '${defaultUser}'),
              (SELECT id FROM "role" WHERE initials = 'USER')
          )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_role');
    await queryRunner.dropTable('role');
    await queryRunner.dropTable('user');
  }
}
