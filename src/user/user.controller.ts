import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersCreateDto } from "./dto/create-user.dto";
import { UsersService } from "./user.service";
// import { User } from "./entities/user.entity";

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() payload: UsersCreateDto): Promise<any> {
    console.log(payload);
    return this.usersService.createUser(payload);
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
