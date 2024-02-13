import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./Config/db.config";
import { BookModule } from "./book/book.module";
import { PaymentModule } from "./payment/payment.module";
import { UsersModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
    }),
    UsersModule,
    BookModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
