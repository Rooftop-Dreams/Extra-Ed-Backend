import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { VectorStoreService } from "src/Config/vector-setvice";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ChatController],
  providers: [ChatService, VectorStoreService],
})
export class ChatModule {}
