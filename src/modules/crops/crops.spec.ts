import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateCropDto, ListCropsDto, UpdateCropDto } from './crop.dto';
import { CropsService } from './crops.service';

describe('Crop validation', () => {
  it('trims names and regions', () => {
    const dto = plainToInstance(CreateCropDto, {
      name: ' Cà chua ',
      regions: [' Miền Nam '],
    });
    expect(validateSync(dto)).toEqual([]);
    expect(dto.name).toBe('Cà chua');
    expect(dto.regions).toEqual(['Miền Nam']);
  });
  it.each([
    { name: '   ' },
    { name: 'a'.repeat(101) },
    { name: 'Cà chua', regions: [''] },
    { name: 'Cà chua', regions: ['Nam', ' Nam '] },
  ])('rejects invalid fields', (value) => {
    expect(
      validateSync(plainToInstance(CreateCropDto, value)).length,
    ).toBeGreaterThan(0);
  });
  it('permits partial updates but rejects null names', () => {
    expect(
      validateSync(plainToInstance(UpdateCropDto, { description: '' })),
    ).toEqual([]);
    expect(
      validateSync(plainToInstance(UpdateCropDto, { name: null })).length,
    ).toBeGreaterThan(0);
  });
  it('validates and transforms pagination', () => {
    const dto = plainToInstance(ListCropsDto, { page: '2', limit: '20' });
    expect(validateSync(dto)).toEqual([]);
    expect(dto.page).toBe(2);
    expect(
      validateSync(plainToInstance(ListCropsDto, { limit: '101' })).length,
    ).toBeGreaterThan(0);
  });
});

describe('CropsService access and search', () => {
  const id = '507f1f77bcf86cd799439011';
  let model: any;
  let service: CropsService;
  beforeEach(() => {
    model = {
      create: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
    };
    service = new CropsService(model);
  });
  it('takes ownership from the authenticated account', async () => {
    await service.create('owner', {
      name: 'Cà chua',
      userId: 'attacker',
    } as any);
    expect(model.create).toHaveBeenCalledWith({
      name: 'Cà chua',
      userId: 'owner',
    });
  });
  it('scopes read, update and delete to the owner', async () => {
    model.findOne.mockResolvedValue({ _id: id });
    model.findOneAndUpdate.mockResolvedValue({ _id: id });
    model.findOneAndDelete.mockResolvedValue({ _id: id });
    await service.findOne(id, 'owner');
    await service.update(id, 'owner', {
      name: 'New',
      userId: 'attacker',
    } as any);
    await service.remove(id, 'owner');
    expect(model.findOne).toHaveBeenCalledWith({ _id: id, userId: 'owner' });
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id, userId: 'owner' },
      { $set: { name: 'New' } },
      { new: true, runValidators: true },
    );
    expect(model.findOneAndDelete).toHaveBeenCalledWith({
      _id: id,
      userId: 'owner',
    });
  });
  it('returns not found for invalid IDs and inaccessible crops', async () => {
    await expect(service.findOne('invalid', 'owner')).rejects.toThrow(
      'Không tìm thấy',
    );
    expect(model.findOne).not.toHaveBeenCalled();
    await expect(service.findOne(id, 'owner')).rejects.toThrow(
      'Không tìm thấy',
    );
    await expect(service.update(id, 'owner', { name: 'New' })).rejects.toThrow(
      'Không tìm thấy',
    );
    await expect(service.remove(id, 'owner')).rejects.toThrow('Không tìm thấy');
  });
  it('escapes search patterns, filters region and paginates within the owner', async () => {
    const chain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([{ name: 'Cà chua' }]),
    };
    model.find.mockReturnValue(chain);
    model.countDocuments.mockResolvedValue(25);
    const result = await service.findAll('owner', {
      page: 2,
      limit: 10,
      search: 'a.*',
      region: 'Miền Nam',
    });
    const filter = model.find.mock.calls[0][0];
    expect(filter.userId).toBe('owner');
    expect(filter.regions).toBe('Miền Nam');
    expect(filter.$or[0].name.$regex).toBe('a\\.\\*');
    expect(model.countDocuments).toHaveBeenCalledWith(filter);
    expect(chain.skip).toHaveBeenCalledWith(10);
    expect(result.meta).toEqual({
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });
});
