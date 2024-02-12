import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./Config/db.config";
import { PaymentModule } from "./payment/payment.module";
import { UserModule } from "./user/user.module";
import { BookModule } from "./book/book.module";
import { CategoryModule } from "./category/category.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { NoteModule } from "./note/note.module";
import { ChatModule } from "./chat/chat.module";
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
    }),
    PaymentModule,
    UserModule,
    BookModule,
    CategoryModule,
    ScheduleModule,
    NoteModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
