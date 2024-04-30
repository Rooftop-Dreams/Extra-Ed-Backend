import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  UploadedFile,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { extname } from "path";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { DocumentDto } from "./dto/docuement.dto";
import { BasicMessageDto } from "./dto/basic-message.dto";
import { ContextAwareMessagesDto } from "./dto/context-aware.dto";
import { PDF_BASE_PATH } from "./const/common.constants";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }
  @Post("upload-document")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "uploads",
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @HttpCode(200)
  async loadPDFData(
    @Body() documentDto: DocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file.filename) {
      documentDto.file = file.filename;
    }
    return await this.chatService.uploadPDF(documentDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.chatService.remove(+id);
  }
  @Post("basic-chat")
  @HttpCode(200)
  async basicChat(@Body() messagesDto: BasicMessageDto) {
    return await this.chatService.basicChat(messagesDto);
  }

  @Post("context-aware-chat")
  @HttpCode(200)
  async contextAwareChat(
    @Body() contextAwareMessagesDto: ContextAwareMessagesDto,
  ) {
    return await this.chatService.contextAwareChat(contextAwareMessagesDto);
  }

  @Post("upload-document")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: PDF_BASE_PATH,
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @HttpCode(200)
  async loadPDF(
    @Body() documentDto: DocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file.filename) {
      documentDto.file = file.filename;
    }
    return await this.chatService.uploadPDF(documentDto);
  }

  @Post("document-chat")
  @HttpCode(200)
  async documentChat(@Body() messagesDto: BasicMessageDto) {
    return await this.chatService.documentChat(messagesDto);
  }

  @Post("agent-chat")
  @HttpCode(200)
  async agentChat(@Body() contextAwareMessagesDto: ContextAwareMessagesDto) {
    return await this.chatService.agentChat(contextAwareMessagesDto);
  }
}
