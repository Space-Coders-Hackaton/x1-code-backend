import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from '../user';

export enum Difficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
}

@Entity('correction')
export class Correction {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.corrections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  challenge_slug: string;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.NORMAL })
  difficulty: Difficulty;

  @Column()
  technology: string;

  @Column()
  rating: number;

  @Column()
  points: number;

  @Column()
  total_tests: number;

  @Column()
  passed_tests: number;

  @Column()
  repository_url: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
