import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { typeOrmConfig } from "./Config/db.config";
import { BookModule } from "./book/book.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Authentication } from "./middleware/authentication";
import { UsersModule } from "./user/user.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
    }),
    UsersModule,
    BookModule,
    // PaymentModule,
  ],
  controllers: [],
  providers: [],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authentication).exclude("users").forRoutes("product");
  }
}
