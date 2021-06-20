import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Role } from '../role';
import { Correction } from '../correction';

@Entity('user')
export class User {
  @PrimaryColumn()
  id: string;

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('varchar', {
    name: 'email',
  })
  email: string;

  @Exclude()
  @Column('varchar', {
    name: 'password',
  })
  password: string;

  @Column('varchar', { name: 'avatar' })
  avatar: string;

  @Column('varchar', { name: 'github' })
  github: boolean;

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

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
