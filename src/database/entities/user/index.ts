import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Role } from '../role';
import { Correction } from '../correction';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    name: 'email',
  })
  email: string;

  @Exclude()
  @Column('varchar', {
    name: 'password',
  })
  password: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles: Role[];

  @OneToMany(() => Correction, (correction) => correction.user)
  corrections: Correction[];

  @Exclude()
  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date;
}
