import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { OpenAI } from "openai";
import { VectorStoreService } from "src/Config/vector-setvice";
import { BasicMessageDto } from "./dto/basic-message.dto";
import { TEMPLATES } from "./const/template.constants";
import { ContextAwareMessagesDto } from "./dto/context-aware.dto";
import { existsSync } from "fs";
import { PDF_BASE_PATH } from "./const/common.constants";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import { DocumentDto } from "./dto/docuement.dto";
import customMessage from "./const/cutom-message";
import { MESSAGES } from "./const/message.constants";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "langchain/schema";
import { openAI, vercelRoles } from "./const/openAI.constants";
import { Message as VercelChatMessage } from "ai";
import { HttpResponseOutputParser } from "langchain/output_parsers";

@Injectable()
export class ChatService {
  private openai: OpenAI;
  private vectorStoreService: VectorStoreService;

  constructor(vectorStoreService: VectorStoreService) {
    this.vectorStoreService = vectorStoreService;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // organization: process.env.OPENAI_ORGANIZATION || '',
    });
  }

  async create(createChatDto: CreateChatDto): Promise<any> {
    try {
      const res = this.openai.chat.completions.create({
        messages: [{ role: "user", content: createChatDto.question }],
        model: "gpt-3.5-turbo",
      });
      return res
        .then((data) => {
          return data.object.length;
        })
        .catch((err) => {
          throw err.message;
        });
    } catch (error) {
      return error;
    }
  }

  async uploadPDFFile(file: any) {
    // https://medium.com/@abdullahirfan99_80517/langchain-with-nestjs-node-framework-talk-with-documents-part-2-980ef5f02b3a
    console.log(file);
    return "dsaf";
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    console.log(updateChatDto);
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async basicChat(basicMessageDto: BasicMessageDto) {
    try {
      const chain = this.loadSingleChain(TEMPLATES.BASIC_CHAT_TEMPLATE);
      const response = await chain.invoke({
        input: basicMessageDto.user_query,
      });
      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async contextAwareChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const messages = contextAwareMessagesDto.messages ?? [];
      const formattedPreviousMessages = messages
        .slice(0, -1)
        .map(this.formatMessage);
      const currentMessageContent = messages[messages.length - 1].content;

      const chain = this.loadSingleChain(TEMPLATES.CONTEXT_AWARE_CHAT_TEMPLATE);

      const response = await chain.invoke({
        chat_history: formattedPreviousMessages.join("\n"),
        input: currentMessageContent,
      });
      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async documentChat(basicMessageDto: BasicMessageDto) {
    try {
      const documentContext = await this.vectorStoreService.similaritySearch(
        basicMessageDto.user_query,
        3,
      );

      const chain = this.loadSingleChain(
        TEMPLATES.DOCUMENT_CONTEXT_CHAT_TEMPLATE,
      );

      const response = await chain.invoke({
        context: JSON.stringify(documentContext),
        question: basicMessageDto.user_query,
      });
      return this.successResponse(response);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  async uploadPDF(documentDto: DocumentDto) {
    try {
      // Load the file
      const file = "/uploads/" + documentDto.file;
      const resolvedPath = path.resolve(file);
      // Check if the file exists
      if (!existsSync(resolvedPath)) {
        throw new BadRequestException("File does not exist.");
      }

      // Load the PDF using PDFLoader
      const pdfLoader = new PDFLoader(resolvedPath);
      const pdf = await pdfLoader.load();

      // Split the PDF into texts using RecursiveCharacterTextSplitter
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 50,
      });
      const texts = await textSplitter.splitDocuments(pdf);
      let embeddings: Document[] = [];

      for (let index = 0; index < texts.length; index++) {
        const page = texts[index];
        const splitTexts = await textSplitter.splitText(page.pageContent);
        const pageEmbeddings = splitTexts.map((text) => ({
          pageContent: text,
          metadata: {
            pageNumber: index,
          },
        }));
        embeddings = embeddings.concat(pageEmbeddings);
      }
      await this.vectorStoreService.addDocuments(embeddings);
      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS);
    } catch (e: unknown) {
      console.log(e);

      this.exceptionHandling(e);
    }
  }

  async agentChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
    try {
      const tools = [new TavilySearchResults({ maxResults: 1 })];

      const messages = contextAwareMessagesDto.messages ?? [];
      const formattedPreviousMessages = messages
        .slice(0, -1)
        .map(this.formatBaseMessages);
      const currentMessageContent = messages[messages.length - 1].content;

      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "You are an agent that follows SI system standards and responds responds normally",
        ],
        new MessagesPlaceholder({ variableName: "chat_history" }),
        ["user", "{input}"],
        new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
      ]);

      const llm = new ChatOpenAI({
        temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
        modelName: openAI.GPT_3_5_TURBO_1106.toString(),
      });

      const agent = await createOpenAIFunctionsAgent({
        llm,
        tools,
        prompt,
      });

      const agentExecutor = new AgentExecutor({
        agent,
        tools,
      });

      const response = await agentExecutor.invoke({
        input: currentMessageContent,
        chat_history: formattedPreviousMessages,
      });
      return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, response.output);
    } catch (e: unknown) {
      this.exceptionHandling(e);
    }
  }

  private loadSingleChain = (template: string) => {
    const prompt = PromptTemplate.fromTemplate(template);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
      modelName: openAI.GPT_3_5_TURBO_1106.toString(),
    });

    const outputParser = new HttpResponseOutputParser();
    return prompt.pipe(model).pipe(outputParser);
  };

  private formatMessage = (message: VercelChatMessage) =>
    `${message.role}: ${message.content}`;

  private formatBaseMessages = (message: VercelChatMessage) =>
    message.role === vercelRoles.user
      ? new HumanMessage({ content: message.content, additional_kwargs: {} })
      : new AIMessage({ content: message.content, additional_kwargs: {} });

  private successResponse = (response: Uint8Array) =>
    customMessage(
      HttpStatus.OK,
      MESSAGES.SUCCESS,
      Object.values(response)
        .map((code) => String.fromCharCode(code))
        .join(""),
    );

  private exceptionHandling = (e: unknown) => {
    Logger.error(e);
    throw new HttpException(
      customMessage(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MESSAGES.EXTERNAL_SERVER_ERROR,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
}
