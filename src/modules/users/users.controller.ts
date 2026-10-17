import { Controller, Get, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IsEmail, IsString, MinLength } from 'class-validator';

class UpdateOwnProfileDto {
  @IsString() @MinLength(3) name?: string;
  @IsEmail() email?: string;
}

class UpdateFcmTokenDto {
  @IsString() @MinLength(1) token: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    if (id !== String(req.user._id)) return this.usersService.forbidden();
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-fcm-token')
  updateFcmToken(@Req() req: any, @Body() body: UpdateFcmTokenDto) {
    return this.usersService.updateToken(req.user._id, body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Req() req: any, @Body() updateUserDto: UpdateOwnProfileDto) {
    if (id !== String(req.user._id)) return this.usersService.forbidden();
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (id !== String(req.user._id)) return this.usersService.forbidden();
    return this.usersService.remove(id);
  }
}
