import { IsNumber, IsOptional, IsString } from "class-validator";

export class AuthenticationDto {
  @IsString()
  email: string;
  @IsNumber()
  @IsOptional()
  phone: number;
  @IsString()
  password: string;
}
