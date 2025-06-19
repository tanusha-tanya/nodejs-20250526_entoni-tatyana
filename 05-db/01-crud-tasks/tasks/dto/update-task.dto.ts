import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}
