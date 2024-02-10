import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
export class CreateProductCategoryDto {
  @ApiProperty()
  @IsString()
  categoryName: string;

  @IsString()
  description: string;
  @IsString()
  @IsOptional()
  createdBy: string;
  @IsString()
  @IsOptional()
  updatedBy: string;
}
