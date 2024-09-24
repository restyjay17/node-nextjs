import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Log } from 'src/logs/entities/log.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  last_name: string;

  @Column()
  first_name: string;

  @Column({ type: 'bigint', nullable: true })
  contact_number: number;

  @Column()
  address: string;

  @Column({
    type: 'smallint',
    default: 0,
    comment: '0 = For Verification, 1 = Active, 2 = Suspended',
  })
  status: number;

  @Column({ type: 'smallint', comment: '1 = Admin, 2 = Staff' })
  role: number;

  @Column({
    type: 'smallint',
    comment: '1 = Main Dealer, 2 = Master Dealer, 3 = Dealer',
  })
  access_type: number;

  @OneToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User;

  @ManyToOne(() => User, (user) => user.followers)
  following: User[];

  @OneToMany(() => Log, (log) => log.created_by)
  logs: Log[];

  @CreateDateColumn({
    type: 'timestamptz',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(2)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(2)',
    onUpdate: 'CURRENT_TIMESTAMP(2)',
  })
  updated_at: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @BeforeUpdate()
  async hashPassword2(): Promise<void> {
    const salt = await bcrypt.genSalt();

    if (
      typeof this.password !== undefined ||
      this.password !== null ||
      this.password !== ''
    )
      this.password = await bcrypt.hash(this.password, salt);
  }
}
