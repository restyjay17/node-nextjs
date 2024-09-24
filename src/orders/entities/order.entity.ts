import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Customer } from 'src/customers/entities/customer.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => Customer, (customer) => customer.customer_id)
  user_id: Customer;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

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
}
