import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
} from "@nestjs/common";
// import { PaymentService } from "./payment.service";
// import { CreatePaymentDto } from "./dto/create-payment.dto";
// import { UpdatePaymentDto } from "./dto/update-payment.dto";
import {
  ChapaService,
  CreateSubaccountOptions,
  InitializeOptions,
  VerifyOptions,
} from "src/chapa-sdk";

@Controller("payment")
export class PaymentController {
  // constructor(private readonly paymentService: PaymentService) {}

  // @Post()
  // create(@Body() createPaymentDto: CreatePaymentDto) {
  //   return this.paymentService.create(createPaymentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.paymentService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.paymentService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentService.update(+id, updatePaymentDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.paymentService.remove(+id);
  // }

  constructor(private readonly chapaService: ChapaService) {}

  @Post("initialize")
  async initialize(@Body() initializeOptions: InitializeOptions) {
    const tx_ref = await this.chapaService.generateTransactionReference();
    return this.chapaService.initialize({
      ...initializeOptions,
      tx_ref,
    });
  }

  @Get("verify/:tx_ref")
  verify(@Param() verifyOptions: VerifyOptions) {
    return this.chapaService.verify(verifyOptions);
  }

  @Post("subaccount")
  createSubaccount(@Body() createSubaccountOptions: CreateSubaccountOptions) {
    return this.chapaService.createSubaccount(createSubaccountOptions);
  }
  @Get("get-banks")
  getBanks() {
    return this.chapaService.getBanks();
  }

  @Post("mobile-initialize")
  initializeMobile(@Body() initializeMobile: InitializeOptions) {
    return this.chapaService.mobileInitialize(initializeMobile);
  }
}
