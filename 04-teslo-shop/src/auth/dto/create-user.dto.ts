import { IsEmail, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    
    @IsString()
    @IsEmail()

    email:  string;

    @IsString()
    @MaxLength(50)
    @IsStrongPassword({ minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 0 }, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    fullName:   string;
}