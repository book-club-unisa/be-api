import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(2, 20)
  firstName: string;

  @IsNotEmpty()
  @Length(2, 20)
  lastName: string;

  @IsNotEmpty()
  @Length(5, 44)
  password: string;

  //per validare obj dentro obj si usa @ValidateNested()
  //@Type(() => CreateAddressDto)
  //@IsNotEmpty()
  //address : CreateAddressDto
}
