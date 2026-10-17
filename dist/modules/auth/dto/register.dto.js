"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
    name;
    email;
    password;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(8, 8, { message: 'Mật khẩu phải có đúng 8 ký tự' }),
    (0, class_validator_1.Matches)(/[A-Z]/, { message: 'Mật khẩu phải có ít nhất một chữ hoa (A-Z)' }),
    (0, class_validator_1.Matches)(/[a-z]/, { message: 'Mật khẩu phải có ít nhất một chữ thường (a-z)' }),
    (0, class_validator_1.Matches)(/[0-9]/, { message: 'Mật khẩu phải có ít nhất một chữ số (0-9)' }),
    (0, class_validator_1.Matches)(/[^\p{L}\p{N}\s]/u, { message: 'Mật khẩu phải có ít nhất một ký tự đặc biệt, ví dụ !@#$%' }),
    (0, class_validator_1.Matches)(/\S/, { message: 'Mật khẩu không được chỉ chứa khoảng trắng' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
//# sourceMappingURL=register.dto.js.map