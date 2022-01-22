import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @Length(6, 30)
  email?: string;

  @IsOptional()
  @Length(2, 20)
  firstName?: string;

  @IsOptional()
  @Length(2, 20)
  lastName?: string;

  @IsOptional()
  @Length(8, 32)
  password?: string;
}
