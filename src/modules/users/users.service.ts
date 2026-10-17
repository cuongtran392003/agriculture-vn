import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Farm } from '../farm/schema/farm.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Farm.name) private farmModel: Model<Farm>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const password = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userModel.create(
        {
          name: createUserDto.name,
          email: createUserDto.email.toLowerCase(),
          password,
          role: 'farmer',
        }
      )
      return {
        message: 'User created successfully',
        data: await this.userModel.findById(user._id).select('-password'),
      }
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
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

  forbidden(): never { throw new ForbiddenException('You can only access your own account'); }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updates: { name?: string; email?: string } = {};
      if (updateUserDto.name !== undefined) updates.name = updateUserDto.name;
      if (updateUserDto.email !== undefined) updates.email = updateUserDto.email.toLowerCase();
      const user = await this.userModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        projection: { password: 0 },
      });
      if (!user) throw new NotFoundException('User not found');
      return {
        message: 'User updated successfully',
        data: user  
      }
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    if (await this.farmModel.exists({ userId: id })) {
      throw new ConflictException('Delete this account’s farms before deleting the account');
    }
    const user = await this.userModel.findByIdAndDelete(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully', data: user };
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
    { new: true, projection: { password: 0 } }
  );

  if (!updatedUser) {
    throw new NotFoundException('User không tồn tại');
  }
  return updatedUser;
}
}
