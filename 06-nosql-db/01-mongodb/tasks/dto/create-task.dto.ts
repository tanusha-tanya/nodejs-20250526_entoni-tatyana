import { IsString, IsNotEmpty, Length } from "class-validator";

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
