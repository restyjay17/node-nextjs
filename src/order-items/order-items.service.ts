import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const orderItem = this.orderItemRepository.create(createOrderItemDto);

    return await this.orderItemRepository.save(orderItem);
  }

  async findAll() {
    return this.orderItemRepository.find();
  }

  async findOne(id: number) {
    return await this.orderItemRepository.findOne({
      where: { order_item_id: id },
    });
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);

    if (!orderItem) throw new NotFoundException();

    Object.assign(orderItem, updateOrderItemDto);

    return await this.orderItemRepository.save(orderItem);
  }

  async remove(id: number) {
    const orderItem = await this.findOne(id);

    if (!orderItem) throw new NotFoundException();

    return await this.orderItemRepository.remove(orderItem);
  }
}
