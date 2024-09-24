import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './user/users.module';
import { IsUniqueConstraint } from './shared/validation/is-unique-constraint';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from '@hedger/nestjs-encryption';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LogsModule } from './logs/logs.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EncryptionModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        key: configService.get('APP_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [join(process.cwd()), 'dist/**/*.entity.ts'],
          useUTC: true,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    LogsModule,
    CustomersModule,
    ProductsModule,
    OrdersModule,
    OrderItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint, JwtStrategy],
})
export class AppModule {}
