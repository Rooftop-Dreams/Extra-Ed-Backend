import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersCreateDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
// import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository,
  ) {}

  createUser = async (payload: UsersCreateDto) => {
    const user = this.userRepository.create(payload);
    return this.userRepository.save(user);
  };

  getUsers = async () => {
    return this.userRepository.find();
  };
}
