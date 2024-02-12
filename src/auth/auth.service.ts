import { Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";

@Injectable()
export class AuthService {
  create(createAuthDto: CreateAuthDto) {
    return "This action adds a new auth";
  }

  async oAuthLogin(user) {
    if (!user) {
      throw new Error("User not found!!!");
    }

    const payload = {
      email: user.email,
      name: user.name,
    };

    const jwt = await this.jwtService.sign(payload);

    return { jwt };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
