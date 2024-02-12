import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(body: any) {
    const { email, age, bio, first_name, last_name, gener, phone } = body;
    const user = await this.userRepo.findOne({ where: { email: email } });

    if (user) {
      return user;
    }

    const newUser = this.userRepo.create({
      email,
      age,
      bio,
      first_name,
      last_name,
      gener,
      phone,
    });
    await this.userRepo.save(newUser);
    return newUser;
  }

  async findUser(id: string) {
    const user = await this.userRepo.findOneById(id);
    return user;
  }

  handlerLogin() {
    return "handlerLogin";
  }

  handlerRedirect() {
    return "handlerRedirect";
  }
}
