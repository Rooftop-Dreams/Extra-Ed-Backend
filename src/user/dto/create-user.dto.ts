import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
export class UsersCreateDto {
  @ApiProperty()
  @IsString()
  first_name: string;
  @ApiProperty()
  @IsString()
  last_name: string;
  @ApiProperty()
  @IsString()
  age: string;
  @ApiProperty()
  @IsString()
  bio: string;
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  gener: string;
  @ApiProperty()
  @IsString()
  grade: string;
  @ApiProperty()
  @IsString()
  phone: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  profilePictureUrl: string;
}
