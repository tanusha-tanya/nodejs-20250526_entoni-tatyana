import { IsString, IsNotEmpty, IsPhoneNumber, IsNumber, IsEmail } from "class-validator";

export class User {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone: string;
}

export class UserValidationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone: string;
}