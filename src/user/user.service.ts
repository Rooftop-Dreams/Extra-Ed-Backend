import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersCreateDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { hashPassword } from "src/Utils/hashPassword";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(@InjectRepository(usersEntity) private readonly usersrepo: userrepository,)
  async create(createDto: UsersCreateDto, file: File) {
    const hashedPassword = await hashPassword(createDto.password);
    const userExists = await this.findAll(createDto.email);
    if (userExists) {
      return new HttpException("email already exit", HttpStatus.FOUND);
    }
    const imagePath = file.path.replace(/\\/g, "/");
    const userRole = await this.roleRepo.findOne({
      where: { roleName: "user" },
    });

    const user = this.usersrepo.create({
      name: createDto.name,
      email: createDto.email,
      password: hashedPassword,
      roleId: userRole.id,
      proPic: `${IMG_URL}${imagePath}`,
    });
    const createdUser = await this.usersrepo.save(user);

    return {
      message: "Successfuly created",
      status: 201,
      user: createdUser,


  }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
