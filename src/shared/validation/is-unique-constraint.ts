import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsUniqueConstraintInput } from './is-unique';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const { tableName, column }: IsUniqueConstraintInput =
      validationArguments.constraints[0];

    const isExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();

    return isExist ? false : true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'record already exist';
  }
}
