import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create(
        {
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
          role: createUserDto.role, 
        }
      )
      return {
        message: 'User created successfully',
        data: user  
      }
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
    }
  }

  findAll() {
    const user = this.userModel.find().select('-password')
    return {
      message: 'User fetched successfully',
      data: user  
    };
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
      return {
        message: 'User updated successfully',
        data: user  
      }
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
    }
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async findByEmail(email: string){
    return await this.userModel.findOne({email})
  }

  async updateToken(userId: string, token: string) {
  if (!userId || !token) {
    throw new BadRequestException('Thiếu UserId hoặc Token');
  }

  const updatedUser = await this.userModel.findByIdAndUpdate(
    userId,
    { $set: { fcmToken: token } }, // Dùng $set để đảm bảo ghi đè/tạo mới field
    { new: true } // Trả về data sau khi đã update
  );

  if (!updatedUser) {
    console.error(`Không tìm thấy user với ID: ${userId}`);
    throw new NotFoundException('User không tồn tại');
  }

  console.log('✅ Cập nhật MongoDB thành công:', updatedUser.fcmToken);
  return updatedUser;
}
}
