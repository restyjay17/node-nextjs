import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 250 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({
    type: 'smallint',
    default: 0,
    comment: '0 = For Verification, 1 = Verified',
  })
  status: number;

  @CreateDateColumn({
    type: 'timestamptz',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(2',
  })
  created_at: Date;

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
