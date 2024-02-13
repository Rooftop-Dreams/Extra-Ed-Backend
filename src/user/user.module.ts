import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";
import { UserEntity } from "./entities/user.entity";
import { MulterConfigService } from "src/middleware/uploadFile";
import { userrepository } from "./user.repository";
import { AuthenticationServise } from "src/auth/auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersService,
    userrepository,
    AuthenticationServise,
    MulterConfigService,
  ],
  controllers: [UsersController],
  exports: [UsersService, MulterConfigService],
})
export class UsersModule {}
