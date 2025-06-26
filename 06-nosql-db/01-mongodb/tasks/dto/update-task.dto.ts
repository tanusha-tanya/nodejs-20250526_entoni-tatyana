import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsBoolean, IsOptional, IsString, Length} from "class-validator";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  
    @IsString({ message: 'Заголовок должен быть строкой' })
    @Length(1, 100, { 
      message: 'Заголовок должен содержать от 1 до 100 символов' 
    })
    title: string;
    
    @IsString({ message: 'Описание должно быть строкой' })
    description: string;

    @IsOptional()
    @IsBoolean()
    isCompleted: boolean;
}
