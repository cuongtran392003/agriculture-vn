import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 8, { message: 'Mật khẩu phải có đúng 8 ký tự' })
    @Matches(/[A-Z]/, { message: 'Mật khẩu phải có ít nhất một chữ hoa (A-Z)' })
    @Matches(/[a-z]/, { message: 'Mật khẩu phải có ít nhất một chữ thường (a-z)' })
    @Matches(/[0-9]/, { message: 'Mật khẩu phải có ít nhất một chữ số (0-9)' })
    @Matches(/[^\p{L}\p{N}\s]/u, { message: 'Mật khẩu phải có ít nhất một ký tự đặc biệt, ví dụ !@#$%' })
    @Matches(/\S/, { message: 'Mật khẩu không được chỉ chứa khoảng trắng' })
    password: string;

}
