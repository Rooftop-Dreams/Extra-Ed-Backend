import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
export class CreateBookDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  price: number;
  @ApiProperty()
  @IsString()
  is_available: boolean;
  //   @ApiProperty()
  //   @IsString()
  //   @IsOptional()
  //   category: string;
  @ApiProperty()
  @IsString()
  grade: number;
  @ApiProperty()
  @IsOptional()
  @IsString()
  cover_image_url: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  pdf_url: string;
  @ApiProperty()
  @IsString()
  category_id: string;
  // @ApiProperty()
  // @IsString()
  // cover: any;
  // @ApiProperty()
  // @IsString()
  // pdf: any;
}
