import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ResponseDto } from '../../common/dto/response.dto';
import { Crop } from './crop.schema';
import { CreateCropDto, ListCropsDto, UpdateCropDto } from './crop.dto';

@Injectable()
export class CropsService {
  constructor(@InjectModel(Crop.name) private readonly crops: Model<Crop>) {}

  private fields(dto: UpdateCropDto) {
    return Object.fromEntries(
      ['name', 'variety', 'description', 'regions']
        .filter((key) => dto[key] !== undefined)
        .map((key) => [key, dto[key]]),
    );
  }

  async create(userId: string, dto: CreateCropDto) {
    return {
      message: 'Đã tạo cây trồng',
      data: await this.crops.create({ ...this.fields(dto), userId }),
    };
  }

  async findAll(userId: string, dto: ListCropsDto) {
    const { page = 1, limit = 10, search, region } = dto;
    const query: Record<string, unknown> = { userId };
    if (search) {
      const literal = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: literal, $options: 'i' } },
        { variety: { $regex: literal, $options: 'i' } },
      ];
    }
    if (region) query.regions = region;
    const [data, total] = await Promise.all([
      this.crops
        .find(query)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.crops.countDocuments(query),
    ]);
    return new ResponseDto(200, 'Danh sách cây trồng', data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    });
  }

  private checkId(id: string) {
    if (!isValidObjectId(id))
      throw new NotFoundException('Không tìm thấy cây trồng');
  }

  async findOne(id: string, userId: string) {
    this.checkId(id);
    const crop = await this.crops.findOne({ _id: id, userId });
    if (!crop) throw new NotFoundException('Không tìm thấy cây trồng');
    return { message: 'Chi tiết cây trồng', data: crop };
  }

  async update(id: string, userId: string, dto: UpdateCropDto) {
    this.checkId(id);
    const crop = await this.crops.findOneAndUpdate(
      { _id: id, userId },
      { $set: this.fields(dto) },
      { new: true, runValidators: true },
    );
    if (!crop) throw new NotFoundException('Không tìm thấy cây trồng');
    return { message: 'Đã cập nhật cây trồng', data: crop };
  }

  async remove(id: string, userId: string) {
    this.checkId(id);
    const crop = await this.crops.findOneAndDelete({ _id: id, userId });
    if (!crop) throw new NotFoundException('Không tìm thấy cây trồng');
    return { message: 'Đã xóa cây trồng', data: crop };
  }
}
