import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { BookEntity } from "src/book/entities/book.entity";
import { UserEntity } from "src/user/entities/user.entity";

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [BookEntity, UserEntity],

  synchronize: true,
});

// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: "postgres",
//       host: "extra-ed-db",
//       port: 5432,
//       username: "postgres",
//       password: "postgres",
//       database: "extra-ed-db",
//       //   entities: [BookEntity],
//       synchronize: true,
//     }),
//   ],
// })
// export class DatabaseModule {}
