import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersCreateDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { RessetPasswordeDto } from "./dto/reset-password.dot";
import { hashPassword } from "src/Utils/hashPassword";
import { AuthenticationDto } from "src/auth/dto/auth-dto";
import { ComparePassword, generrateToken } from "src/Utils/comparePassword";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository,
  ) {}

  async resetPassword(resetPasswordDto: RessetPasswordeDto): Promise<any> {
    try {
      const userExists = await this.getusers(resetPasswordDto.email);
      if (userExists) {
        //send email
      }
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllusers(): Promise<any> {
    try {
      const user = await this.userRepository.find({
        where: { isDeleted: false },
      });

      return {
        message: "Success",
        status: 200,
        user: user,
      };
    } catch (error) {
      return new HttpException("user not found", HttpStatus.NOT_FOUND);
    }
  }

  async getuserById(id: string): Promise<object> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id, isDeleted: false },
      });

      if (!user) {
        return new HttpException("user not found", HttpStatus.NOT_FOUND);
      }

      return {
        message: "Success",
        status: 200,
        user: user,
      };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(createDto: UsersCreateDto, file: any): Promise<object> {
    try {
      const hashedPassword = await hashPassword(createDto.password);
      const userExists = await this.getusers(createDto.email);

      if (userExists) {
        return new HttpException("email already exists", HttpStatus.FOUND);
      } else {
        const imagePath = file.path.replace(/\\/g, "/");
        createDto.profilePictureUrl = imagePath;
        createDto.password = hashedPassword;
        const user = this.userRepository.create(createDto);
        const createdUser = await this.userRepository.save(user);

        return createdUser;
      }
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getusers(email: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email, isDeleted: false },
      });

      return user;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async userLogin(authDto: AuthenticationDto): Promise<any> {
    try {
      const user = await this.getusers(authDto.email);
      if (!user) {
        return new HttpException("email doesnt exist", HttpStatus.BAD_REQUEST);
      } else {
        const cheakPassword = await ComparePassword(
          authDto.password,
          user.password,
        );

        if (cheakPassword) {
          const token = await generrateToken(user.id, process.env.JWT_SECRET);
          return {
            message: "Successfuly loggedIn",
            user: user,
            token: token,
          };
        } else {
          return new HttpException(
            "incorrect Password",
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, updateDto: UpdateUserDto): Promise<any> {
    try {
      const updatedUser = this.userRepository.update(id, updateDto);
      return updatedUser;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const deletedUser = await this.userRepository.update(id, {
        isDeleted: true,
      });
      return deletedUser;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
