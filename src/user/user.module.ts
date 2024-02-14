import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";
import { UserEntity } from "./entities/user.entity";
import { userrepository } from "./user.repository";
import { AuthenticationServise } from "src/auth/auth.service";
import { MulterModule } from "@nestjs/platform-express";
import { multerConfig } from "src/Utils/uploadImage";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.register(multerConfig),
  ],
  providers: [UsersService, userrepository, AuthenticationServise],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
