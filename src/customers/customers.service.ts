import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);

    return await this.customerRepository.save(customer);
  }

  async findAll() {
    return await this.customerRepository.find();
  }

  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { customer_id: id },
    });

    if (!customer) throw new NotFoundException();

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    if (!customer) throw new NotFoundException();

    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);

    if (!customer) throw new NotFoundException();

    return await this.customerRepository.remove(customer);
  }
}
