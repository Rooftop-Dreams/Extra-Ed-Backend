import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
// import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "./Config/db.config";
// import { BookModule } from "./book/book.module";
// import { PaymentModule } from "./payment/payment.module";
import { UsersModule } from "./user/user.module";
import { BookModule } from "./book/book.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookEntity } from "./book/entities/book.entity";
// import { AppController } from "./app.controller";
// import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: typeOrmConfig,
    // }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "extra-ed-db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "extra-ed-db",
      entities: [BookEntity],
      synchronize: true,
    }),
    // UsersModule,
    BookModule,
    // PaymentModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
