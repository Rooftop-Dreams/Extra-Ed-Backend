import { Body, Controller, Post } from "@nestjs/common";
import { UsersCreateDto } from "./dto/create-user.dto";
import { UsersService } from "./user.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() payload: UsersCreateDto): Promise<void> {
    console.log(payload);
    return this.usersService.createUser(payload);
  }
}
