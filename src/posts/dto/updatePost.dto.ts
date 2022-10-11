import { IsOptional, IsString } from "class-validator";

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  title: string;
}

export default UpdatePostDto;