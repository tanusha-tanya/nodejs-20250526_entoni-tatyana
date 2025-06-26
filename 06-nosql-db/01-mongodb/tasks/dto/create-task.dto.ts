import { IsString, IsNotEmpty, Length } from "class-validator";

export class CreateTaskDto {

  @IsString({ message: 'Заголовок должен быть строкой' })
  @IsNotEmpty({ message: 'Заголовок обязателен для заполнения' })
  @Length(1, 100, { 
    message: 'Заголовок должен содержать от 1 до 100 символов' 
  })
  title: string;
  
  @IsString({ message: 'Описание должно быть строкой' })
  description: string;

}